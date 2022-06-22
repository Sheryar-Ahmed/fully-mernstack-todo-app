const router = require('express').Router();

//import todo schema that we created 

const todoItemsModel = require('../models/todoitems');

//create our first route to save the user todo to the mongodb

router.post('/api/item', async (req,res) => {
    try{
        const newTodoItem = new todoItemsModel({
            item: req.body.item,
        })
        //save item int he db
        const saveItem = await  newTodoItem.save();
        res.status(200).json(saveItem);
    }catch(err){
        res.json(err);
    }
})

//get all todos from the db

router.get('/api/items',async (req,res) => {
    const getAllTodos = await todoItemsModel.find({});
    res.status(200).json(getAllTodos);
})

//create our second route to update the todo according to it's id.

router.put('/api/item/:id',async (req,res) => {
    try{
        //find the item and update it according to its id
        const updateTodoItem = await todoItemsModel.findByIdAndUpdate(req.params.id,{$set: req.body});
        res.status(200).json("Todo Updated Successfully");
    }catch(err){
        res.json(err);
    }
})
//delete the specific todo from the db
router.delete('/api/item/:id', async (req,res) => {
    const deleteTodo = await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted successfully");
})



//we have to export he module in order to use it in our index.js file
module.exports = router;