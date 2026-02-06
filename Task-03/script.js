/*
1.Вывести в консоль сумму всех целых чисел от 50 до
100.
*/
let sum = 0;
for (let i = 50; i <= 100; i++) {
    sum += i;
}

console.log(sum);

/*
2.Вывести в консоль таблицу умножения на 7.
7 x 1 = 7
7 x 2 = 14
…
7 x 9 = 63
*/

const factor = 7;
for (let i = 1; i <= 9; i++) {
    console.log(`${factor} x ${i} = ${factor * i}`)
}

/*
*Запросить у пользователя ввод числа N. Вывести в
консоль среднее арифметическое всех нечётных
чисел от 1 до N.
*/

const input = +prompt('Enter your number');
let summa = 0;
let count = 0;
for (let i = 1; i <= input; i = i + 2) {
    summa += i;
    count ++;
}
console.log(summa / count);