/*
1.Запросите у пользователя дату в формате
ДД.ММ.ГГГГ. Напишите программу, выводящую день
недели по введённой дате.
*/

const dateString = prompt('Enter your date dd.mm.yyyy: ')
const [day, month, year] = dateString.split('.');
const dayNumberOfWeek = new Date(`${year}-${month}-${day}`).getDay();
const daysNamesOfWeek = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота'
];

console.log(daysNamesOfWeek[dayNumberOfWeek]);

/*
2.Написать программу, которая выводит в консоль
количество минут, прошедшее с начала сегодняшнего
дня.
*/

const Hours = new Date(Date.now()).getHours();
const Minutes = new Date(Date.now()).getMinutes();
console.log(Hours * 60 + Minutes);

/*
3.*В двух переменных хранятся даты рождения двух
пользователей в формате ДД.ММ.ГГГГ. Написать
программу, которая определяет более молодого
пользователя.
*/

const user1 = {name: 'Alex', age: '10.09.1993'};
const user2 = {name: 'Dmitry', age: '15.01.1993'};

function strToDate(dateString) {
   const [day, month, year] = dateString.split('.');
   return new Date(`${year}-${month}-${day}`)
}

console.log(strToDate(user1.age) > strToDate(user2.age)? user1 : user2);