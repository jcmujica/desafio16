const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var cors = require('cors')
const MongoStore = require('connect-mongo');
const { config: dotEnvConfig } = require('dotenv');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const Productos = require('./productos');
const Mensajes = require('./mensajes');
const Usuarios = require('./usuarios');
const { options: mongoOptions } = require('./db/mongo/config');
const argv = require('minimist')(process.argv.slice(2));
const PORT = argv.port || 8080;
const config = require('./db/firebase/config');
const childProcess = require('child_process');

const productos = new Productos({
    name: 'productos',
    options: config
});

const mensajes = new Mensajes({
    name: 'mensajes',
    options: config
})

const usuarios = new Usuarios({
    name: 'usuarios',
    cnxStr: mongoOptions.url,
    params: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}, mongoose.model('usuario', mongoose.Schema({
    username: String,
    password: String
})));

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


dotEnvConfig();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoOptions.url,
        autoReconnect: true,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}));

app.get('/api/user', (req, res) => {
    if (req.session.user) {
        const { _doc } = req.session.user;
        res.send({
            username: _doc.username,
            _id: _doc._id
        });
    } else {
        res.send({ error: 'No user logged in' });
    };
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const result = await usuarios.register({ username, password });

    if (result._id) {
        req.session.user = result;
    };
    res.send(result);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await usuarios.login({ username, password });

    if (result._id) {
        req.session.user = result
    };
    res.send(result);
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.send(true);
});

app.get('/info', (req, res) => {
    const info = {
        args: process.argv.slice(2),
        platform: process.platform,
        version: process.version,
        memoryUsage: process.memoryUsage().rss,
        path: process.cwd(),
        pid: process.pid,
        projectFolder: __dirname,
    };
    res.send(info);
});

app.get('/api/randoms', (req, res) => {
    const { cant } = req.query;
    const child = childProcess.fork('./randoms.js');

    child.send({ cant });

    child.on('message', (data) => {
        res.send(data);
    });

});

io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    try {
        socket.emit('listProducts', await productos.getAll());
        socket.emit('listMessages', await mensajes.getAll());
        socket.on('submitProduct', async (prod) => {
            await productos.save(prod);
            io.sockets.emit('listProducts', await productos.getAll());
        });
        socket.on('submitMessage', async (msg) => {
            await mensajes.create(msg);
            io.sockets.emit('listMessages', await mensajes.getAll());
        });
    } catch (e) {
        console.log(e)
    }
});

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

connectedServer.on('error', (err) => { console.error(err) });