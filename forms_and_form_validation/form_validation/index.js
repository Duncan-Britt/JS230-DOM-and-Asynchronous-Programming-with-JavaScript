document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const inputs = form.querySelectorAll('input');

  form.addEventListener('submit', e => {
    e.preventDefault()

    form.checkValidity() ? console.log("valid") : console.log("invalid");
    if (form.checkValidity()) {
      const formData = new FormData(document.querySelector('form'));
      const dataObj = {
        first_name: encodeURIComponent(formData.get('first_name')),
        last_name: encodeURIComponent(formData.get('last_name')),
        email: encodeURIComponent(formData.get('email')),
        password: encodeURIComponent(formData.get('password')),
        phone_number: encodeURIComponent(formData.get('phone_number')),
        credit_card: encodeURIComponent(formData.getAll('credit_card').join('')),
      };

      let encodedStrs = [];
      for (let key in dataObj) {
        if (dataObj.hasOwnProperty(key)) {

          encodedStrs.push(encodeURIComponent(key) + '=' + dataObj[key]);
        }
      }

      let encodedStr = encodedStrs.join('&');
      console.log(encodedStr);
      // const xhr = new XMLHttpRequest();
      // xhr.open('GET', "#");
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      // xhr.send(encodedStr);
      document.querySelector('#serialized').insertAdjacentHTML(
        'beforeend',
        Handlebars.compile(document.querySelector('#template').innerHTML)({ encodedStrs })
      );
    }
  });

  inputs.forEach(input => {
    input.addEventListener('focusout', validate);
  });

  inputs.forEach(input => {
    input.addEventListener('focus', e => {
      if (e.target.type !== 'submit')
        e.target.parentElement.parentElement.lastElementChild.style.display = "none";
    });
  });

  Array.from(document.querySelectorAll('input')).filter(input => {
    return ["credit_card", "first_name", "last_name"].includes(input.name);
  }).forEach(input => {
    if (input.name === "credit_card") {
      input.addEventListener('keypress', e => {
        if (!/\d/.test(e.key) || input.value.length >= 4) {
          e.preventDefault();
        }
      });

      input.addEventListener('keyup', e => {
        if (input.id !== "last" && input.value.length === 4) {
          input.nextElementSibling.focus();
        }
      });
    } else {
      input.addEventListener('keypress', e => {;
        if (!/[a-z]/i.test(e.key)) {
          e.preventDefault();
        }
      });
    }
  });
});

let CONSOLE;

function validate(e) {
  const input = e.currentTarget;

  if (!input.checkValidity()) {
    input.parentElement.parentElement.lastElementChild.style.display = "inline";
  }
}
