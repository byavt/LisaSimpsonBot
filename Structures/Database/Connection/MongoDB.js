const { mongoose } = require("mongoose");
const DATABASE = process.env.MONGO_URL;

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
