const tracker = function() {
  const divRed = document.getElementById('red');
  const divOrange = document.getElementById('orange');
  const divBlue = document.getElementById('blue');
  const divGreen = document.getElementById('green');

  let elements = [divBlue, divRed, divGreen, divOrange];
  let events = [];
  return {
    push(event) {
      events.push(event.target);
    },

    clear() {
      events = [];
    },

    list() {
      return events.slice();
    },

    elements() {
      return elements.slice();
    },
  };
}();

function track(callback) {
  return function(event) {
    tracker.push(event);
    callback(event);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const divRed = document.getElementById('red');
  const divOrange = document.getElementById('orange');
  const divBlue = document.getElementById('blue');
  const divGreen = document.getElementById('green');

  divRed.addEventListener('click', track(event => {
    document.body.style.background = 'red';
  }));

  divBlue.addEventListener('click', track(event => {
    event.stopPropagation();
    document.body.style.background = 'blue';
  }));

  divOrange.addEventListener('click', track(event => {
    document.body.style.background = 'orange';
  }));

  divGreen.addEventListener('click', track(event => {
    document.body.style.background = 'green';
  }));
});
