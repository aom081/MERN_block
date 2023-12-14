const express = require("express");
const cors = require("cors");
const mongoose = require ("mongoose");
require("dotenv").config();
const User = require("./Models/User");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({credentials: true, origin: "http://localhost:5173"}));
app.use(express.json());

//Database
const MOMGODB_URI = process.env.MOMGODB_URI;
mongoose.connect(MOMGODB_URI);

app.get("/", (req, res) => {
    res.send("<h1> This is a RestFUL for SE NPRU Blog</h1>");
})

//User Register
const salt = bcrypt.genSaltSync(100);
app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

//User login
const secret = process.env.SECRET;
app.post('/login', async (req,res)=>{
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
    if(isMatchedPassword){
        //logged in
        jwt.sign({username, id:userDoc}, secret, {} , (err, token) => {
            if (err)  throw err;
            //Save data in cookie
            res.cookie("token", token).json({
                id: userDoc.id,
                username,
            });
        });
    }else{
        res.status(400).json("wrong credentials");
    }
});

//log out
app.post("/logout", (req,res) => {
    res.cookie("token","").json("ok");
})


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
})