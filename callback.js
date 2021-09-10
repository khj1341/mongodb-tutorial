const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            return callback('a, b must be numbers'); // callback의 첫번째 인자는 error 메세지
        }

        callback(undefined, a + b); // error 메세지 없이 보내고, 결과값 return
    }, 3000);
}

const callback = (error, sum) => {
    if(error) return console.log({ error }) // error 에서  error: error 처럼 key value가 같으면 error 만 적어도됨
    console.log({ sum });
}

addSum('10', 20, callback);