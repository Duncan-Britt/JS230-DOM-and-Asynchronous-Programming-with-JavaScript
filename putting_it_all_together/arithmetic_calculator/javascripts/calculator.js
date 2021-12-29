let CONSOLE;
document.addEventListener("DOMContentLoaded", () => {
  // CONSTANTS
  const OPERATIONS = {};
  ['+', '-', '*', '/'].forEach(op => {
    OPERATIONS[op] = new Function('a', 'b', 'return a' + op + 'b');
  });

  // DOM ELEMENTS
  const form = document.querySelector('form');
  const n1Input = document.getElementById('first-number');
  const n2Input = document.getElementById('second-number');
  const operatorInput = document.getElementById('operator');
  const resultEl = document.getElementById('result');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const n1 = parseFloat(n1Input.value, 10);
    const n2 = parseFloat(n2Input.value, 10);
    const operator = operatorInput.value;

    resultEl.textContent = OPERATIONS[operator](n1, n2);
  });
  CONSOLE = form;
});
