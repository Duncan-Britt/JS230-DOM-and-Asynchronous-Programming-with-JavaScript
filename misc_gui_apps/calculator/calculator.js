'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const registerElement = document.querySelector('#register');
  const stackElement = document.querySelector('#stack');
  let fakeStack = null;
  let lastOperator = null;
  let flashStack = false;

  document.querySelector('#buttons').addEventListener('click', e => {
    const input = e.target.textContent;
    if (['+', '-', '/', '*', '%'].includes(input)) {
      operatorPressEvent(input);
    } else {
      switch (input) {
        case '=':
          registerElement.textContent = eval(`${fakeStack} ${lastOperator} ${registerElement.textContent}`);
          fakeStack = null;
          lastOperator = null;
          flashStack = true;
          stackElement.textContent = '';
          break;
        case 'CE':
          registerElement.textContent = '0';
          flashStack = false;
          break;
        case 'C':
          fakeStack = null;
          lastOperator = null;
          flashStack = false;
          stackElement.textContent = '';
          registerElement.textContent = '0';
          break;
        case 'NEG':
          if (registerElement.textContent[0] === '-')
            registerElement.textContent = registerElement.textContent.slice(1);
          else
            registerElement.textContent = '-' + registerElement.textContent;
          break;
        default:
          if (registerElement.textContent === '0' || flashStack) {
            registerElement.textContent = input;
            flashStack = false;
          } else {
            registerElement.textContent += input;
          }
      }
    }
  });

  function operatorPressEvent(newOperator) {
    let register = Number(registerElement.textContent);
    stackElement.textContent = stackElement.textContent + register + ' ' + newOperator + ' ';

    if (!fakeStack) {
      fakeStack = register;
    } else {
      switch (lastOperator) {
        case '+':
          fakeStack += register;
          break;
        case '-':
          fakeStack -= register;
          break;
        case '*':
          fakeStack *= register;
          break;
        case '/':
          fakeStack /= register;
          break;
        case '%':
          fakeStack %= register;
          break;
      }
    }

    registerElement.textContent = fakeStack;
    flashStack = true;
    lastOperator = newOperator;
  }
});
