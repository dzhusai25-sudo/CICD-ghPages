/*
1.В переменных a и b хранятся числа. Вывести в
консоль наибольшее из них.
*/

const a = 25;
const b = 77;
if (a > b) {
    console.log(a);
}
else {
    console.log(b);
}

/*
2.Запросить у пользователя ввод числа от 1 до 12.
Вывести в консоль название месяца, соответствующее
этому числу (1 — январь, 2 — февраль и т.д.).
*/

const input = +prompt('Enter a month number: ');
let monthName = '';
switch (input) {
    case 1:  monthName = 'January';  break;
    case 2:  monthName = 'February'; break;
    case 3:  monthName = 'March';    break;
    case 4:  monthName = 'April';    break;
    case 5:  monthName = 'May';      break;
    case 6:  monthName = 'June';     break;
    case 7:  monthName = 'July';     break;
    case 8:  monthName = 'August';   break;
    case 9:  monthName = 'September'; break;
    case 10: monthName = 'October';  break;
    case 11: monthName = 'November';  break;
    case 12: monthName = 'December'; break;
    default: monthName = 'Invalid number. Please enter a number from 1 to 12.';
}
console.log(monthName);

/*
*В переменных circle и square хранятся площади круга
и квадрата соответственно. Написать программу,
которая определяет, поместится ли круг в квадрат.
*/

const circle = 100;
const square = 20;

const diameter = 2 * Math.sqrt(circle / Math.PI);
const side = Math.sqrt(square);

diameter <= side? console.log('Круг поместится в квадрат') : console.log('Круг не поместится в квадрат');
