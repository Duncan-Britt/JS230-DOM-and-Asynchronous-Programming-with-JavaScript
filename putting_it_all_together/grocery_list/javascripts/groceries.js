let CONSOLE;
document.addEventListener("DOMContentLoaded", () => {
  // DOM ELEMENTS
  const form = document.querySelector('form');
  const nameInput = document.querySelector('#name');
  const qtyInput = document.querySelector('#quantity');
  const listEl = document.querySelector('#grocery-list');

  // FORM SUBMISSION - ADD ITEM TO GROCERY LIST
  form.addEventListener('submit', e => {
    e.preventDefault();
    const getValue = selector => document.querySelector(selector).value;

    // const itemName = nameInput.value;
    const itemName = getValue('#name');
    // const qty = qtyInput.value || '1';
    const qty = getValue('#quantity') || '1';
    const li = document.createElement('li');
    li.textContent = qty + ' ' + itemName;
    listEl.appendChild(li);
    form.reset();
  });
});
