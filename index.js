const express = require("express")
const mongoose = require("mongoose")
const User = require('./models/users')  

const port = 8080;
const uri = "mongodb://localhost:27017/my_db"
const app = express()
app.use(express.json())

app.listen(port, ()=>{
    console.log("Server is running. http://localhost:"+port);
})

// mongodb connection

mongoose.connect(uri).then(()=>{
    console.log("Database connected");
})
.catch((error)=>{
    console.log("failed to connect to database",);
    
})
const db = mongoose.connection;
db.on("open", ()=>console.log("Database connection is open"))
db.on("error", (error)=>console.log("Connection error: ", error))
///////////////////////////////

app.get('/', (req, res)=>{
    res.json({message: "Backend is live"})
})

// insert a user
app.post('/user/add', async (req, res)=>{
    const data = req.body;
    const user = new User(data);
    await user.save()
    .then(response=>{
        res.json({message: "user Added", details: user})
    })
    .then(err=>{
        res.json({error: "Failed to add user", error_message: err})
    })
})

// view users
app.get('/user/view', async (req, res)=>{
    const users = await User.find()
    res.json(users)
})

// individual search
app.get('/user/view/single/:id', async (req, res)=>{
    const uid = req.params.id
    const user = await User.findById(uid)
    res.json(user);
})

// update users
app.put('/user/update/:id', async (req, res)=>{
    const uid = req.params.id
    const data = req.body
    const user = await User.findByIdAndUpdate(uid, data, {new: true})

    res.json({success: "User Updated", details: user})
    
})

app.delete('/user/delete/:id', async (req, res)=>{
    const id = req.params.id;
    const user = await User.findBydIdAndDelete(id)
    res.json({message: "User Deleted"})
})

