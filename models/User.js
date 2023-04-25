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
    ClassList: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isTeacher: {
        type: Boolean,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

// class User {
//     constructor(username, password) {
//         this.username = username;
//         this.password = password;
//     }
// }

// class Student extends User {
//     constructor(username, password) {
//         super(username, password); // Calls the User constructor
//     }

// }

// class Teacher extends User {
//     constructor(username, password) {
//         super(username, password); // Calls the User constructor
//         this.Polls = Array(new Poll());
//         this.Classes = Array(new ClassContainer(username));
//     }

//     addPoll(poll) {
//         this.Polls.push(poll);
//     }
// }