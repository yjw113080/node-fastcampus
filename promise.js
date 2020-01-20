


let p1 = new Promise(
    (resolve, reject) => {
        console.log("프로미스 함수 제작");

        setTimeout(() => {
            resolve( {log: "༼ꉺɷꉺ༽"})
        }, 500);
    }
);

let p2 = new Promise(
    (resolve, reject) => {
        console.log("두 번째 프로미스");

        setTimeout(() => {
            resolve( {log: "ʕ•ᴥ•ʔ"})
        }, 500);
    }
);

p1.then( (firstPromise) => {
    console.log(firstPromise.log);
    return p2;
}).then((secondPromise) => {
    console.log(secondPromise.log);
})

console.log("=================");

Promise.all([p1, p2])
.then((result) => {
    console.log(result);
    console.log("첫번째 프로미스에서 나온 값입니다: "+ result[0].log);
    console.log("두번째 프로미스에서 나온 값입니다: "+ result[1].log);
})