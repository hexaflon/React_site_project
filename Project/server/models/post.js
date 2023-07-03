const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date } // Ustawienie wartości domyślnej na bieżącą datę
});

const Post = mongoose.model("Post", postSchema);

const validatePost = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        content: Joi.string().required().label("Content"),
        date: Joi.date().label("date"),
    });
    return schema.validate(data);
};
const validateUpdate = (data) => {
    const schema = Joi.object({
        id: Joi.string().required().label("id"),
        content: Joi.string().required().label("Content"),
        date: Joi.date().label("date"),
    });
    return schema.validate(data);
};

module.exports = { Post, validatePost, validateUpdate };
