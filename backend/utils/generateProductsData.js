const { faker } = require('@faker-js/faker');

const generateProductsData = (amount) => {
    const products = [];

    for (let i = 0; i < amount; i++) {
        const message = {
            id: i,
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl(),
            description: faker.lorem.paragraph(),
            sku: faker.commerce.productAdjective(),
            stock: faker.datatype.number()
        };
        products.push(message);
    };

    return products;

};

module.exports = generateProductsData;