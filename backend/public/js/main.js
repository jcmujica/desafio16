const socket = io.connect();
let products = [];
let messages = [];

const initialize = async () => {
    const renderTemplate = async () => {
        const user = await checkSession();
        if (!user) return;
        const path = window.location.pathname;
        const rawTemplate = path.includes('logout') ? await fetch('logout.hbs') : await fetch('home.hbs');
        const template = await rawTemplate.text();
        const templateFunction = Handlebars.compile(template);
        const body = document.querySelector('body');
        body.innerHTML = templateFunction({ products: products, messages: messages, user: user });

        const submitMessageButton = document.getElementById('submitMessageButton');
        submitMessageButton?.addEventListener('click', submitMessage);

        const logoutButton = document.getElementById('logout');
        logoutButton?.addEventListener('click', logout);
    };

    socket.on('listProducts', (prods) => {
        products = prods;
        renderTemplate();
    });

    socket.on('listMessages', (msgs) => {
        messages = msgs;
        renderTemplate();
    });
};

const submitProduct = () => {
    const productName = document.getElementById('name').value;
    const productPrice = document.getElementById('price').value;
    const productImage = document.getElementById('image').value;
    const product = {
        name: productName,
        price: productPrice,
        thumbnail: productImage
    };

    socket.emit('submitProduct', product);
    return false;
};

const submitMessage = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const text = document.getElementById('message').value;
    const name = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;
    const alias = document.getElementById('alias').value;
    const avatar = document.getElementById('avatar').value;
    const date = new Date().toLocaleString('en-GB');
    const error = document.getElementById('error');
    const message = {
        author: {
            email: email,
            name: name,
            lastName: lastName,
            age: age,
            alias: alias,
            avatar: avatar,
            date: date
        },
        text: text
    };

    if (!email || !text || !name || !lastName || !age || !alias || !avatar) {
        error.classList.remove('hidden');
        return
    } else {
        error.classList.add('hidden');
    }

    socket.emit('submitMessage', message);
};

const logout = async () => {
    const result = await fetch('/api/logout', {
        method: 'GET'
    });

    const res = await result.json();

    if (res) {
        window.location.href = '/logout';
    }
};

const checkSession = async () => {
    const result = await fetch('/api/check-session');
    const res = await result.json();

    if (!res || res?.expires < Date.now() || !res?.user) {
        logout();
        window.location.href = '/login';
        return false;
    } else {
        console.log('res?.user?._doc', res?.user?._doc)
        return res?.user?._doc;
    };
};

initialize();