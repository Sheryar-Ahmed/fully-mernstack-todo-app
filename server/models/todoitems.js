//import mongoose to create the new Schema;
const mongoose = require('mongoose');

//create Schema here

const TodoItemSchema = mongoose.Schema({
    item: {
        type : String,
        required: true
    }
})

//export default

module.exports = mongoose.model('todo', TodoItemSchema);