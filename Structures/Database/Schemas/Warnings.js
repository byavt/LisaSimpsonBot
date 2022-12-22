const { model, Schema } = require("mongoose");

module.exports = model(
    "warns-db", new Schema({
        Guild: String,
        User: String,
        UserTag: String,
        Content: Array,
    }),
);