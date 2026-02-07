/*
1.Даны длины трёх сторон треугольника. Определить,
является ли треугольник прямоугольным.
*/

const ab = 2;
const bc = 12;
const ca = 6;

function isRightTriangle(a,b,c) {
    const arr = [a, b, c];
    const sides = arr.sort((a, b) => b - a);
    return sides[0]*sides[0] === sides[1]*sides[1] + sides[2]* sides[2];
}

isRightTriangle(ab,bc,ca);

/*
2.Пользователь вводит число R. Написать программу,
которая выведет в консоль длину окружности и
площадь круга с радиусом R.
*/

const R = +prompt('Enter Radius');
console.log(2 * Math.PI * R);
console.log(Math.PI * R * R);

/*
*Пользователь вводит числа a, b и c. Написать
программу, выводящую корни квадратного
уравнения с коэффициентами a, b и c.
*/

const a = +prompt('a: ');
const b = +prompt('b: ');
const c = +prompt('c: ');

const D = b * b - 4 * a * c;
    const x1 = ( -b + Math.sqrt(D) ) / (2 * a);
    const x2 = ( -b - Math.sqrt(D) ) / (2 * a);
    console.log(x1, x2);