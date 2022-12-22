const { model, Schema } = require("mongoose");

module.exports = model(
    "nowPlayingMessage", new Schema({
        Guild: String,
        Message: String
    }),
);