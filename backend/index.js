const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./Models/User");
const Post = require("./Models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const uploadMiddleware = require({ dest: "upload/" });
const fs = require("fs");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser);
//set static(public) folder
app.use("/uploads", express.static(__dirname+"/uploads"));

//Database
const MOMGODB_URI = process.env.MOMGODB_URI;
mongoose.connect(MOMGODB_URI);

app.get("/", (req, res) => {
    res.send("<h1> This is a RestFUL for SE NPRU Blog</h1>");
})

//User Register
const salt = bcrypt.genSaltSync(100);
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
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
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
    if (isMatchedPassword) {
        //logged in
        jwt.sign({ username, id: userDoc }, secret, {}, (err, token) => {
            if (err) throw err;
            //Save data in cookie
            res.cookie("token", token).json({
                id: userDoc.id,
                username,
            });
        });
    } else {
        res.status(400).json("wrong credentials");
    }
});

//log out
app.post("/logout", (req, res) => {
    res.cookie("token", "").json("ok");
})

//create Post
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    const { token } = req.cookies;
    jwt.verify(token, secret, async (err, info) => {
        if (err) throw err;
        const { title, summary, connect } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            connect,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
});

app.get("/posts", async (req, res) => {
    res.json(
        await Post.find()
            .populate("author", ["username"])
            .sort({ createdAt: -1 })
            .limit(20)
    )

})

app.get("/post/:id", async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    res.json(postDoc)
})

app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    jwt.verify(token, secret, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, connect } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
        if (!isAuthor) {
            return res.status(400).json("You are not ");
        }
        postDoc.updateOne({
            title,
            summary,
            connect,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
    
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
})