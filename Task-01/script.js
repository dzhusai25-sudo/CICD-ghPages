/*
1.В переменных a и b хранятся числа. Написать
программу, которая выводит в консоль произведение
и сумму этих чисел.
*/

const a = 2;
const b = 5;
console.log(a * b);
console.log(a + b);

/*
2.В двух переменных хранятся строки символов.
Написать программу, которая выведет в консоль
суммарное количество символов в обоих строках.
*/

const c = 'Hello';
const d = 'JavaScript';
console.log(c.length + d.length);

/*
3.*Написать программу, которая запрашивает у
пользователя ввод трёхзначного числа, а потом
выводит в консоль сумму цифр введённого числа.
*/

const Str = prompt('Enter your 3 digit number');
const input = Number(Str);
if (Str.length === 3 && input >= 100 && input <= 999) {
    const arr = Str.split('');
    console.log(Number(arr[0]) + Number(arr[1]) + Number(arr[2]));
}
else
    alert('bad value');
