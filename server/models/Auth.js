//import mongoose to create the new Schema;
const mongoose = require('mongoose');

//create Schema here

const usersSchema = mongoose.Schema({
    Email: {
        type : String,
        required: true
    },
    password: {
        type : String,
        required : true
    }
})

//export default

module.exports = mongoose.model('users', usersSchema);