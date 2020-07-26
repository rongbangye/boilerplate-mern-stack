// nodemon auto start server: npm run backend
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// add the config folder for security
const config = require('./config/key');
const { User } = require('./model/user');
const { auth } = require('./middleware/auth');

mongoose.connect(config.mongoURI, 
    {useNewUrlParser: true }).then(() => console.log('DB connected'))
                             .catch(err => console.error('err'));

// Node.js body parsing middleware - Parse incoming request bodies in a middleware before your handlers, availabe under the req.body property
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
// Prase cookie header and populate req.cookies with an object keyed by the cookies names. 
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("hello Dev");
});

// Authentication middleware
app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})
 
// Register routing
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, userData) => {
        if(err) return res.json ({ success: false, err})
        return res.status(200).json({
            success: true,
            userData: doc
        })
    })
})

app.post('/api/user/login', (req, res) => {
    // find Email 
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

    // compare Password 
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch) {
            return res.json({ loginSuccess: false, message: "wrong password" })
        }
    })

    // generate Token
    user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        res.cookie("x_auth", user.token)
            .status(200)
            .json({
                loginSuccess: true
            })
    })
    })
})

// logout function, remove token from cookie
app.get("/api/user/logout", auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, { token: "" }, (err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(5000);