const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Usuarios {
    constructor(config, model, name) {
        this.name = name;
        this.mongoose = mongoose.connect(config.cnxStr, config.params);
        this.model = model;
    }

    async login(data) {
        try {
            const { username, password } = data;
            let item = await this.model.findOne({ username: `${username}` });

            if (item) {
                let isValid = await bcrypt.compare(password, item.password);
                if (isValid) {
                    const { password, ...user } = item;
                    return {
                        ...user,
                        _id: item._id.toString()
                    };
                } else {
                    return { error: "invalid password" };
                };
            } else {
                return { error: "invalid username" };
            };
        } catch (e) {
            console.log(e);
            return { error: "error in login" };
        }
    }

    async register(data) {
        try {
            const { username, password } = data;
            const encryptedPassword = await bcrypt.hash(password, saltRounds);
            console.log("encryptedPassword", encryptedPassword);
            let item = await this.model.create({ username, password: encryptedPassword });

            if (item) {
                return {
                    ...item,
                    _id: item._id.toString()
                };
            } else {
                return { error: "error in register" };
            }
        } catch (e) {
            console.log(e);
            return { error: "error in register" };
        }
    }
};

module.exports = Usuarios;