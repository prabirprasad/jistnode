const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./db/mongoose');
const User = require('./models/user')
const Feedback = require('./models/feedback')
const Notice = require('./models/notice')
const adminRouter = require('./routers/admin')
const userRouter = require('./routers/user')
const departmentRouter = require('./routers/departments')



// Express init
const app = express();



// Defining the port
const port = process.env.PORT || 3000;



// Setup path variables for Express configs
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');



// Serving public dir
app.use(express.static(publicPath));
app.use('/images', express.static('images'));
app.use('/admin', express.static(publicPath));
app.use('/user', express.static(publicPath));
app.use('/departments', express.static(publicPath));



// Setup view engine and hbs configs
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);



// hbs helpers functions
hbs.registerHelper('select', function (selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});



// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



// Global Vars
global.isAdminLogged = false;



// To call all the routes related to Department
app.use(departmentRouter)
// To call all the routes related to Admin
app.use(adminRouter)
// To call all the routes related to User
app.use(userRouter)



// Start the server
app.listen(port, () => {
    console.log('Server running on port '+ port);
})
