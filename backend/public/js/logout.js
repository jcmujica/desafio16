const logoutScreen = async () => {
    const rawTemplate = await fetch('logout.hbs');
    const template = await rawTemplate.text();
    const templateFunction = Handlebars.compile(template);
    const body = document.querySelector('body');
    body.innerHTML = templateFunction();

    setTimeout(() => {
        location.href = '/login';
    } , 2000);
};

logoutScreen();