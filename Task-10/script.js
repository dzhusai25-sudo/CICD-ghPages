/*
Пользователь вводит текстовую строку. Определить с 
помощью регулярного выражения, является ли 
введённая строка:
*/

// 1.Датой.
function isDate(input) {
  const regExDate = /^(0[1-9]|[12][0-9]|3[01])[.\-](0[1-9]|1[0-2])[.\-]\d{4}$/;
  return regExDate.test(input);
}

// 2.Адресом электронной почты.
function isEmail(input) {
  const regExEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regExEmail.test(input);
}

// 3.*Номером телефона.
function isPhone(input) {
  const cleaned = input.replace(/[\s\-\(\)\+]/g, "");
  const regExPhone = /^[78]\d{10}$/;
  return regExPhone.test(cleaned);
}

function checkInput(input) {
    if (isDate(input))
        return 'дата'; 
    else if (isEmail(input))
        return 'email';
    else if (isPhone(input))
        return 'номер телефона';
    else
        return '"не соответствует ни одному формату"';
}

const input = prompt ('Введите дату или email или номер телефона');
console.log(`${input} - ${checkInput(input)}`);