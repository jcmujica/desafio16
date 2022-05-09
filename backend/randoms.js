const generateRandomNumbers = (cant) => {
    const amount = cant || 100_000_000;
    console.log("generateRandomNumbers", amount)
    const numbers = Array.from({ length: amount }, () => Math.floor(Math.random() * 1000) + 1);

    const result = numbers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});

    return result;
};

process.on("message", (data) => {
    const { cant } = data;
    process.send(generateRandomNumbers(cant));
})