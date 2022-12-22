const { model, Schema } = require("mongoose");

module.exports = model(
    "mod-logschannel", new Schema({
        Guild: String,
        Channel: String,
    }),
);