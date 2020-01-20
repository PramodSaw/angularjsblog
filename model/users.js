const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator')
var bcrypt = require('bcrypt-nodejs')

// User Name Validator
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\s]+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    })
];
var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: 'email must be at least 3 characters, max 40, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}',
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [6, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];
// var phoneValidate= [
//     validate({
//         validator: 'matches',
//         arguments: '/^[+-]?[0-9]+(,[0-9]+)?$/',
//         message: 'Please enter a valid Phone number'
//     })
// ]
const usersSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        index: true,
        unique: true,
        validate:usernameValidator
    },
    password: {
        type: String,
        required: true,
        validate:passwordValidator,
        select: false
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true,
        validate: emailValidator
    },
    name: {
        type: String,
        required: true,
        validate: nameValidator
    },
    phone: {
        type: Number,
        required: true,
        //validate: phoneValidate
    },
    active: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    temporarytoken: { 
        type: String, 
        required: true 
    },
    resettoken: {
        type: String,
        required: false
    },
    permission: {
        type:String,
        required: true,
        default: 'user'
    },
    userImage: {
        type: String
    }
});



usersSchema.plugin(uniqueValidator,{ message: '{PATH}({VALUE}) is already taken' });
usersSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next()
    });
})

usersSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
usersSchema.plugin(titlize, {
    paths: [ 'name' ]
  });
const User = module.exports = mongoose.model('User', usersSchema);