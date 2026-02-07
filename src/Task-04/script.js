//Создайте объект user, содержащий поле name со значением ‘John’.
/*
1.Запросить у пользователя ввод числа. Записать
введенное значение в поле age объекта user.
*/

const user = {name: 'John'};
user.age = +prompt('fill John\'s age: ');

/*
2.Создать копию объекта user с именем admin.
Добавить новому объекту поле role со значением
‘admin’
*/

admin = Object.assign({}, user);
admin.role = 'admin';

/*
*Записать все значения полей объекта admin в
отдельные переменные. Имена переменных
должны совпадать с названиями полей.
*/

let {name, age, role} = admin;
console.log(name, age, role);
