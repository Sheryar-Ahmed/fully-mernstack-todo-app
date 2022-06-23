const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
//checking the privateKEy
if(!process.env.todo_jwtPrivateKey){
    console.error("Fatal Error, jwtPrivateKey is not defined");
    process.exit(1);
}
//to get data in json format we use app.use.
app.use(express.json());
//import our router in order to use it here.
const todoItemsRouter = require('./routes/todoItems');
const PORT = process.env.PORT || 5500;
//allow different addresses to access our api use cors
app.use(cors());
//connect to mongoose
mongoose.connect(process.env.MONGO_CONNECTION)
.then(() => console.log("Database Connected"))
.catch(() => console.log(err));
//user our router in app

app.use('/',todoItemsRouter);


app.listen(PORT, () => console.log("server is running"));