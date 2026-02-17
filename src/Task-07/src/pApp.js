/*
Сверстать страницу и подключить к ней файл со скриптом. На странице должны быть три текстовых параграфа, поле ввода и кнопка. 
Напишите скрипт, который будет выполнять следующие условия:
1.Кнопка скрыта, если в поле ввода нет значения.
2.При клике на кнопку добавляется новый параграф, содержащий текст из поля ввода.
3.Если параграфов становится больше 5, первый из них удаляется.

const paragraphs = document.querySelector('.paragraphs');
const input = document.querySelector('.input');
const button = document.querySelector('.button');

export function changeButtonVisibility() {button.hidden = !input.value.length}

export function addParagraphs() {
    const newP = document.createElement('p');
    newP.innerText = input.value;
    paragraphs.append(newP)
    if (paragraphs.childElementCount > 5) paragraphs.firstElementChild.remove();
    input.value = '';
    button.hidden = true}

input.addEventListener('input', changeButtonVisibility);
button.addEventListener('click', addParagraphs);

*/

export function pApp(el) {
  el.innerHTML = `
    <div class="paragraphs">
        <p>Текст параграфа 1</p>
        <p>Текст параграфа 2</p>
        <p>Текст параграфа 3</p>
    </div>
    <input class='input' type="text">
    <button class="button" hidden="true">Добавить параграф</button>
    `;

  const paragraphs = el.querySelector('.paragraphs');
  const input = el.querySelector('.input');
  const button = el.querySelector('.button');

  function changeButtonVisibility() {
    button.hidden = !input.value.length;
  }

  function addParagraphs() {
    const newP = document.createElement('p');
    newP.innerHTML = input.value;
    paragraphs.append(newP);
    if (paragraphs.childElementCount > 5) paragraphs.firstElementChild.remove();
    input.value = '';
    button.hidden = true;
  }

  input.addEventListener('input', changeButtonVisibility);
  button.addEventListener('click', addParagraphs);
}
