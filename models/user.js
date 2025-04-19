const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true,
    }
});

// Tell passport to use `email` as the username field
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model('User', userSchema);
