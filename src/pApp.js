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

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('app'); // или 'container'

  if (!el) {
    console.error('Элемент #app не найден в DOM!');
    return;
  }

  pApp(el); // Вызываем вашу функцию
});
