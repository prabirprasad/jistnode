const path = require('path');
const express = require('express')
const hbs = require('hbs');
const multer = require('multer')

// To call the User model
const User = require('../models/user')
const Feedback = require('../models/feedback')
const Notice = require('../models/notice')
const router = new express.Router()



//-------------------------------------------------All the Admin related Routes---------------------------------\\



// Get Admin route
router.get('/admin', (req, res) => {
   
    if (!isAdminLogged) {
        return res.redirect('/admin/login');
    }
        res.redirect('/admin/dashboard');
})



// Admin Login
router.get('/admin/login', (req, res) => {
    res.render('./admin/login');
})



// Admin Login
// Checking Credentials before logging in
router.post('/admin/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if(username === 'admin' && password === 'admin'){
        global.isAdminLogged = true;
        return res.redirect('/admin/dashboard')
    }

    res.render('./admin/login', {login_error: 'Incorrect Credentials! Please try again.'})

} )



// Admin Dashboard
router.get('/admin/dashboard', async (req, res) => {
    
    try{

        // checking if admin logged in
         if (!isAdminLogged) {
             return res.redirect('/admin/login')
        }

        const users = await User.find().sort({ _id : -1 }).limit(10);
        res.render('./admin/dashboard', { users });

    } catch(e){

        if (err){
            res.status(500).send('Server Error! Please try later.')
        }
    }

})



// Get Add Student route
router.get('/admin/addUser', async (req, res) => {

    try{

        // checking if admin logged in
        if (!isAdminLogged) {
           return res.redirect('/admin/login')
        }
         res.render('./admin/add-user');
    } catch(err) {
        
        if (err) {
            res.status(500).send('Server Error! Please try later.')
        }
    }
})



// Add User by Admin 
router.post('/admin/addUser', async (req, res) => {

    try {

           // checking if admin logged in
           if (!isAdminLogged) {
               return res.redirect('/admin/login')
           }

        const user = new User(req.body)
        await user.save()
        res.render('./admin/add-user', {'success_msg': 'User added Successfully'});
    } catch (e) {   

        if (e) {
          res.render('./admin/add-user', { error_msg: 'Some error occured. Please Try again.' });
        }
    }
})



// Providing particular User's data to Admin
router.get('/admin/user/:id', async (req, res) => {
    const _id = req.params.id;
    try{

        //checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }

        const user = await User.findById(_id);

        if (!user) {
                    return res.status(404).send('User not found!')
                }
                res.render('./admin/user-info', user)

    }catch(e){
        res.status(500).send('Server error!') 
    }
})



// Providing all Users data to Admin
router.get('/admin/allUsers', async (req, res) => {

    try{

        //checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }

        const users = await User.find({}).sort({ _id : -1 })
        res.render('./admin/all-user', {users})
    }catch(e){
        res.status(500).send('Server error!') 
    }
})


// Get User Update Route
router.get('/admin/updateUser/:id', async (req, res) => {
    const _id = req.params.id;
    try{

        //checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }

        const user = await User.findById(_id);

        res.render('./admin/update-user', user)

    } catch(e){
        res.status(500).send('Error: Server Error! Please try again.');
    }
})



// Updating a particular User's details by Admin
router.post('/admin/updateUser/:id', async (req,res) => {
    
    const _id = req.params.id;
    try{

        //checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }

        const updates = Object.keys(req.body)
        const allowedUpdates = ['fullname', 'email', 'password', 'course', 'department', 'semester', 'phone', 'address', 'father']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({
                error: 'Invalid updates!'
            })
        }

        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update]) 
        await user.save()
        
        if (!user) {
            return res.status(404).send('Error: Student not found.')
        }
        res.locals.success_msg = "User's Details Updated Successfully"
        res.redirect('/admin/updateUser/'+_id)
    }catch(e){
        res.status(400).send('update_error: Error occured while Updating!')
    }
})



// Deleting a particular User's details by Admin
router.get('/admin/deleteUser/:id', async (req, res) => {
    const _id = req.params.id;
    try{

        //checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }

        const user= await User.findByIdAndDelete(_id)

        res.redirect('/admin/allUsers')
    
    }catch(e){
        res.status(500).send('Error : Server Error!')
    }
})



// Providing all Feedback to Admin
router.get('/admin/feedbacks', async (req, res) => {

    try {

        //checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }

        const feedbacks = await Feedback.find({}).sort({ _id : -1 })
        res.render('./admin/feedback', { feedbacks })
    } catch (e) {
        res.status(500).send('Server error!')
    }
})


// Get Add Notice route
router.get('/admin/addNotice', async (req, res) => {

    try {

        // checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }
        res.render('./admin/notice');
    } catch (err) {

        if (err) {
            res.status(400).send('Server Error! Please try later.')
        }
    }
})


const storage =multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})


const upload = multer({

    storage : storage,
    
    limits: {
        fileSize: 1000000
    },
    
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)) {

        return cb(new Error('File must be a jpg, jpeg, or png... '))
        }
        cb(undefined, true)
    }

})

// Add Notice by Admin 
router.post('/admin/addNotice', upload.single('upload'), async (req, res) => {


    try {

        // checking if admin logged in
        if (!isAdminLogged) {
            return res.redirect('/admin/login')
        }
        
            console.log(req.file)
            const notice = new Notice({
            title: req.body.title,
            description: req.body.description,
            upload: (req.file.destination + '/' + req.file.originalname)
        })
        await notice.save(notice)

        res.render('./admin/notice', { 'success_msg': 'Notice added Successfully' });

    } catch (e) {

        if (e) {
            res.render('./admin/notice', { error_msg: 'Server Error. Please Try again.' });
        }
    }
}
, (error, req, res, next) => {
    res.render('./admin/notice', { error: error.message })
})



// Admin Log-Out
router.get('/admin/logout', (req, res) => {
    
    global.isAdminLogged = false;
        res.redirect('/admin/login');

})



module.exports = router
