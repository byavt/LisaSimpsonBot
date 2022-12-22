const { mongoose } = require("mongoose");
const DATABASE = "mongodb+srv://pilahito:uHxnRgzXGr8m1J2v@cluster0.m3dz2r8.mongodb.net/?retryWrites=true&w=majority";

function Connect() {
    if (!DATABASE) {
        console.log('⚠ | MongoDB no esta configurado!');
    }

    mongoose
        .connect(DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log(`✅ | ` + ('MongoDB conectado!'))
        }).catch(err => {
            console.log(`- ERROR -\n`, (err));
        });
}

module.exports = Connect;