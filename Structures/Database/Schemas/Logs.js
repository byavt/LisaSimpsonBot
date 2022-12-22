const { model, Schema } = require("mongoose");

module.exports = model(
    "logs-channel", new Schema({
        Guild: String,
        Channel: String,
        //Logs: {
            //InviteLogging: Boolean,
            //ChannelLogging: Boolean,
            //VoiceChannelLogging: Boolean,
            //GreetingLogging: Boolean,
            //AltLogging: Boolean,
        //}
    }),
);