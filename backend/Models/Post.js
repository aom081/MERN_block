const mongoose = require("mongoose")
const { Schema, model } = mongoose;
const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: Schema.Type.ObjectId, ref: "user" },
},
    {
        timestamps: true,
    }
);
const PostModel = model("Post", PostSchema);
model.exports = PostModel;