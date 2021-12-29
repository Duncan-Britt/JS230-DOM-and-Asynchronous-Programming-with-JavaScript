const questions = [
  {
    id: 1,
    description: "Who is the author of <cite>The Hitchhiker's Guide to the Galaxy</cite>?",
    options: ['Dan Simmons', 'Douglas Adams', 'Stephen Fry', 'Robert A. Heinlein'],
  },
  {
    id: 2,
    description: 'Which of the following numbers is the answer to Life, the \
                  Universe and Everything?',
    options: ['66', '13', '111', '42'],
  },
  {
    id: 3,
    description: 'What is Pan Galactic Gargle Blaster?',
    options: ['A drink', 'A machine', 'A creature', 'None of the above'],
  },
  {
    id: 4,
    description: 'Which star system does Ford Prefect belong to?',
    options: ['Aldebaran', 'Algol', 'Betelgeuse', 'Alpha Centauri'],
  },
];

Handlebars.registerHelper('isCorrect', function(submittedAnswer) {
  console.log(submittedAnswer);
  return true;
});

const answerKey = { '1': 'Douglas Adams', '2': '42', '3': 'A drink', '4': 'Betelgeuse' };
let submitted = false;

function reset() {
  document
  .querySelector('form')
  .innerHTML = Handlebars.compile(
                 document.querySelector('#quiz_template')
                 .innerHTML)({ questions });
  submitted = false;

  document.querySelector('button[type="button"]').addEventListener('click', () => {
    reset();
  });
}

function submitHandler(e) {
  e.preventDefault();
  if (submitted) return;
  submitted = true;

  const formData = new FormData(document.querySelector('form'));
  Object.keys(answerKey).forEach(id => {
    if (formData.get(id) === answerKey[id]) {
      document.querySelector(`#q${id}`)
      .insertAdjacentHTML('beforeend', '<p>Correct</p>');
    } else if (formData.get(id) === null) {
      document.querySelector(`#q${id}`)
      .insertAdjacentHTML('beforeend', "<p>You didn't answer</p>");
    } else {
      document.querySelector(`#q${id}`)
      .insertAdjacentHTML('beforeend', '<p>Wrong Answer</p>');
    }
  });
}

const form = document.querySelector('form');
form.addEventListener('submit', submitHandler);


reset();
