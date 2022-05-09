const {config} = require("dotenv");
config();

const options = {
    url: process.env.MONGO_URL,
}

module.exports = {
    options
}