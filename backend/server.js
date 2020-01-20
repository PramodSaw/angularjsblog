var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var app = express();
var router = express.Router();
app.use(express.static('../frontend'));
const blogs = require('./route/blogs')(router);
const user = require('./route/user')(router);
const blog = require('./route/blog')(router);
var passport = require('passport');
const config = require('./config/database')
var social = require('./passport/passport')(app, passport);


mongoose.Promise = global.Promise;
mongoose.connect(config.uri, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
mongoose.connection.on('connected', ()=>{
    console.log('MongoDB connected at port 27017');
})

mongoose.connection.on('error', (err)=>{
    console.log(err);
})

const PORT = 3000;

app.use(cors());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTION, DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-Type, Accept, Authorization, sid');
    next();
  });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/blog', blog);
app.use('/blogs', blogs);
app.use('/user', user);
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))

// app.get('/', (req, res)=>{
//     res.send("Pramod")
// })

app.listen(PORT, ()=>{
    console.log("Server has been started on port:"+PORT)
})
