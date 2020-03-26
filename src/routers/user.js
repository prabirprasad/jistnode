const path = require('path');
const express = require('express')
const hbs = require('hbs');
const User = require('../models/user')
const Feedback = require('../models/feedback');
const Notice = require('../models/notice')


// To call all the routers related to User
const router = new express.Router()



//-------------------------------------------------All the User related Routes---------------------------------\\




// Get index route
router.get('', (req, res) => {
    res.render('index')
})



// Get register route
router.get('/register', (req, res) => {
    res.render('register')
})



// User's Sign-Up
router.post('/register', async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        res.redirect(201, '/login');

    } catch (err) {

        if (err.code == 11000) {
            res.status(500).send('Username/Email taken. Try with another one')
        }
    }
})



// Get login route
router.get('/login', (req, res) => {
    res.render('login')
})



// User's Login
// Checking Credentials before logging in
router.post('/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const userId = user._id.toString();
        global.userIsLoggedIn = true;
        global.user = user;
        res.redirect('/login/'+ userId)
    }catch(e){
        if (e) {
        res.status(400).render('login', { error: 'Incorrect Credentials. Please Try again.' })
            }
    }
})



// Providing User data after Login
router.get('/login/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);

        if (userIsLoggedIn) {

        if (!user) {
                    return res.status(404).send('User not found! Incorrect Credentials.')
                }
                res.render('user-info', user)
    }else{
        return res.status(401).send('Error occured: Please login first.');
    }

    }catch(e){
        res.status(401).send('User Not Found!.') 
    }
})



// Get User Log-Out Route
router.get('/logout', (req, res) => {
    res.send("<p>Logged out successfully. go to <a href='/'>homepage</a> </p> ")

})



// Get User Feedback Route
router.get('/feedback', (req, res) => {
    res.render('feedback');
})



// User's Feedback
router.post('/feedback', async (req, res) => {

    const feedback = new Feedback(req.body);

    try {
        await feedback.save();
        // res.send("<p>Feedback submitted successfully. Thank you for your feedback. Go to <a href='/'>homepage</a> </p> ");
         res.render('feedback', { 'success_msg': 'Feedback submitted successfully. Thank you for your feedback.' });

    } catch (err) {
        res.status(500).send('Server Error! Please try again.')
    }
})



// Get User Notice Route
router.get('/notice', async (req, res) => {

    const notices = await Notice.find({}).sort({ _id : -1 })
    res.render('notice', { notices})

})



// Get Faculty route
router.get('/faculty', (req, res) => {
    res.render('faculty')
})



// Get Principal route
router.get('/principal', (req, res) => {
    res.render('principal')
})


// Get Board of Governer route
router.get('/board-of-governer', (req, res) => {
    res.render('board-of-governer')
})


// Get Admission route
router.get('/admission', (req, res) => {
    res.render('admission')
})

router.get('/abcd', (req,res) => {
    res.render('abcd')
})

// Get 404 route
router.get('*', (req, res) => {
    res.send('404 error occured')
})



module.exports = router