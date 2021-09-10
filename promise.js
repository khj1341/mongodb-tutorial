const addSum = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') {
                reject('a, b must be numbers') // return 필요없음
            }

            resolve(a + b);

        }, 0);
    })
}

// addSum(10, 20)
//     .then(sum1 => addSum(sum1, 1)) // sum 에서  sum: sum 처럼 key value가 같으면 sum 만 적어도됨
//     .then(sum1 => addSum(sum1, 1))
//     .then(sum1 => addSum(sum1, 1))
//     .then(sum1 => addSum(sum1, 1))
//     .then(sum2 => console.log({ sum2 }))
//     .catch(error => console.log({ error })); // error 에서  error: error 처럼 key value가 같으면 error 만 적어도됨

const totalSum = async () => {
    try {
        const sum = await addSum(10, 10);
        const sum2 = await addSum(sum, 10);    
        console.log({ sum, sum2 });
    } catch (err) {
        console.log({ err });
    }
}

totalSum();