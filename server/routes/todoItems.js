const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//import todo schema that we created 

const todoItemsModel = require('../models/todoitems');
const userModel = require('../models/Auth');

//user Authentication, first register the user

router.post('/api/users', async (req, res) => {
    try {
        //check if the user is already registered.
        let user = await userModel.findOne({ Email: req.body.Email });
        if (user) return res.status(400).json("User already Exists");

        user = new userModel({
            Email: req.body.Email,
            password: req.body.password
        })
        const salt = await bcrypt.genSalt(10);
        //here we updating the user password to encryption so if our database is hacked then the hacker cannot have access to accounts.
        user.password = await bcrypt.hash(user.password, salt);
        //save the user form in the db
        const saveUser = await user.save();
        //let's suppose the user registered and we don't want him to login then we add token to the header.
        const token = jwt.sign({ id: user._id }, process.env.todo_jwtPrivateKey);

        res.header('x-auth-token', token).status(200).json({ id: saveUser._id, Email: saveUser.Email });
    } catch (err) {
        res.json(err);
    }
})

//authenticating the user

router.post("/api/auth", async (req, res) => {
    try {
        const user = await userModel.findOne({ Email: req.body.Email });
        if (!user) return res.status(400).json("Invalid Email or password");

        //we have a compare property in bcrypt which compares the current user password to the client.
        const validatePass = await bcrypt.compare(req.body.password, user.password);
        if (!validatePass) return res.status(400).json("Invalid Email or password");

        //generating the token is very neccessary.
        const token = jwt.sign({ id: user._id }, process.env.todo_jwtPrivateKey);
        res.status(200).json({Token: token, Email:user.Email});
    } catch (err) {
        res.json(err);
    }
})
//create our first route to save the user todo to the mongodb

router.post('/api/item', async (req, res) => {
    try {
        const newTodoItem = new todoItemsModel({
            item: req.body.item,
            Email: req.body.Email
        })
        //save item int he db
        const saveItem = await newTodoItem.save();
        res.status(200).json(saveItem);
    } catch (err) {
        res.json(err);
    }
})

//get all todos from the db

router.get('/api/items', async (req, res) => {
    const getAllTodos = await todoItemsModel.find({});
    res.status(200).json(getAllTodos);
})

//create our second route to update the todo according to it's id.

router.put('/api/item/:id', async (req, res) => {
    try {
        //find the item and update it according to its id
        const updateTodoItem = await todoItemsModel.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).json("Todo Updated Successfully");
    } catch (err) {
        res.json(err);
    }
})
//delete the specific todo from the db
router.delete('/api/item/:id', async (req, res) => {
    const deleteTodo = await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted successfully");
})



//we have to export he module in order to use it in our index.js file
module.exports = router;