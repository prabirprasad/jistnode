const express = require('express');
const router = new express.Router();





// Get Admin route
router.get('/departments', (req, res) => {
    res.render('department');
})


// bsc
router.get('/departments/physics', (req, res) => {
    res.render('department', {
        department: 'Physics'
    })
})

router.get('/departments/chemistry', (req, res) => {
    res.render('department', {
        department: 'Chemistry'
    })
})

router.get('/departments/mathematics', (req, res) => {
    res.render('department', {
        department: 'Mathematics'
    })
})

router.get('/departments/cs-and-it', (req, res) => {
    res.render('department', {
        department: 'CS & IT'
    })
})

// engineering 
router.get('/departments/civil', (req, res) => {
    res.render('department', {
        department: 'Civil Engineering'
    })
})


router.get('/departments/mechanical', (req, res) => {
    res.render('department', {
        department: 'Mechanical Engineering'
    })
})


router.get('/departments/etc', (req, res) => {
    res.render('department', {
        department: 'ETC Engineering'
    })
})

router.get('/departments/pei', (req, res) => {
    res.render('department', {
        department: 'PE&I Engineering'
    })
})

router.get('/departments/mechanical', (req, res) => {
    res.render('department', {
        department: 'Mechanical Engineering'
    })
})

// others

router.get('/departments/humanities', (req, res) => {
    res.render('department', {
        department: 'Humanities'
    })
})


module.exports = router;