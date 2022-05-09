let response = null;

const register = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = {
        username: username,
        password: password,
    };
    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const res = await result.json();

    if (res?._id) {
        window.location.href = '/';
    } else if (res.error) {
        response = res;
        renderTemplate();
    };
};

const login = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = {
        username: username,
        password: password,
    };
    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const res = await result.json();

    if (res?._id) {
        window.location.href = '/';
    } else if (res.error) {
        response = res;
        renderTemplate();
    };
};

const renderTemplate = async () => {
    const path = window.location.pathname;
    const rawTemplate = path.includes("register") ? await fetch('register.hbs') : await fetch('login.hbs');
    const template = await rawTemplate.text();
    const templateFunction = Handlebars.compile(template);
    const body = document.querySelector('body');

    body.innerHTML = templateFunction(response);

    const registerButton = document.getElementById("register");
    registerButton?.addEventListener("click", register);

    const loginButton = document.getElementById("login");
    loginButton?.addEventListener("click", login);
};

renderTemplate();