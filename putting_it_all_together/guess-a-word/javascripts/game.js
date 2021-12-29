
document.addEventListener('DOMContentLoaded', () => {
  // DOM ELEMENTS
  const message = document.querySelector('#message');
  const letters = document.querySelector("#spaces");
  const guesses = document.querySelector("#guesses");
  const apples = document.querySelector("#apples");
  const replay = document.querySelector("#replay");

  // FUNCTIONS
  const randomWord = function() {
    const words = ['apple', 'banana', 'orange', 'pear'];
    return function randomWord() {
      return words.splice(Math.floor(Math.random() * words.length), 1)[0];
    }
  }();

  function Game() {
    if (!(this instanceof Game)) return new Game();

    this.nBadGuesses = 0;
    this.lettersGuessed = [];
    this.nGoodGuesses = 0;
    this.maxWrongGuesses = 6;
    this.word = randomWord();

    if (!this.word) {
      this.displayMessage("Sorry, I've run out of words!");
      return this;
    }

    while (letters.children[1]) {
      letters.children[1].remove();
    }
    while (guesses.children[1]) {
      guesses.children[1].remove();
    }
    message.textContent = "";
    document.body.classList.remove('win');
    document.body.classList.remove('lose');
    for (let i = 1; i < 7; ++i) {
      apples.classList.remove(`guess_${i}`);
    }
    replay.style.visibility = 'hidden';

    for (let i = 0; i < this.word.length; i++) {
      const span = document.createElement('span');
      letters.appendChild(span);
    }
  }

  Game.prototype.displayMessage = function(text) {
    message.textContent = text;
  }

  // DRIVER
  let game = new Game();

  function keyPressHandler(e) {
    const chr = String.fromCharCode(e.which).toLowerCase();
    if (!chr.match(/[a-z]/)) return;
    if (game.lettersGuessed.includes(chr)) return;

    game.lettersGuessed.push(chr);
    const span = document.createElement('span');
    span.textContent = chr;
    guesses.appendChild(span);
    if (game.word.includes(chr)) {
      let nCorrect = 0;
      for (let i = 0; i < letters.children.length; i++) {
        if (game.word[i] === chr) {
          letters.children[i + 1].textContent = chr;
          nCorrect++;
        } else if (game.lettersGuessed.includes(game.word[i])) {
          nCorrect++;
        }
      }

      if (nCorrect === game.word.length) {
        document.removeEventListener('keyup', keyPressHandler);
        message.textContent = "You win!";
        document.body.classList.add('win');
        replay.style.visibility = 'visible';
      }
    } else {
      if (++game.nBadGuesses === game.maxWrongGuesses) {
        message.textContent = "Sorry! You're out of guesses"
        document.body.classList.add('lose');
        replay.style.visibility = 'visible';
      }
      apples.classList.add(`guess_${game.nBadGuesses}`);
    }
  }

  document.addEventListener('keyup', keyPressHandler);

  replay.addEventListener('click', () => {
    game = new Game();
    document.addEventListener('keyup', keyPressHandler);
  });
});
