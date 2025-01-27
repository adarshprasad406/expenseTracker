const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: true, minlength: 6 },
})

module.exports = {
    userModel: mongoose.model('user_schema', userSchema)
}