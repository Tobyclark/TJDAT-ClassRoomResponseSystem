const mongoose = require('mongoose');

// Holds a username, password and then an object for the type of user they are (teacher or student)
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isTeacher: {
        type: Boolean,
        required: true
    },
    ClassList: {
        type: mongoose.Types.ObjectId,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
