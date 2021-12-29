document.addEventListener("DOMContentLoaded", () => {
  hrEl = document.querySelector('#hr');
  mEl = document.querySelector('#m');
  sEl = document.querySelector('#s');
  msEl = document.querySelector('#ms');

  resetTime();
  document.querySelector('#start').addEventListener('click', startPause);
  document.querySelector('#reset').addEventListener('click', resetTime);
});

let paused = true;
let interval;

let hrEl;
let mEl;
let sEl;
let msEl;

let timeF = new Intl.NumberFormat('default', { minimumIntegerDigits: 2})

function startPause() {
  if (paused) {
    interval = setInterval(() => {
      let prevMs = parseInt(msEl.textContent, 10);
      let prevS = parseInt(sEl.textContent, 10);
      let prevM = parseInt(mEl.textContent, 10);
      let prevHr = parseInt(hrEl.textContent, 10);
      msEl.textContent = timeF.format((prevMs + 1) % 100);
      if (prevMs == 59) {
        sEl.textContent = timeF.format((prevS + 1) % 60);

        if (prevS == 59) {
          mEl.textContent = timeF.format((prevM + 1) % 60);

          if (prevM == 59) {
            hrEl.textContent = timeF.format((prevHr + 1) % 100);
          }
        }
      }
    }, 10);
    paused = false;
    document.querySelector('#start').textContent = "Stop";
  } else {
    clearInterval(interval);
    paused = true;
    document.querySelector('#start').textContent = "Start";
  }
}

function resetTime() {
  hrEl.textContent = "00";
  mEl.textContent = "00";
  sEl.textContent = "00";
  msEl.textContent = "00";
  clearInterval(interval);
  paused = true;
  document.querySelector('#start').textContent = "Start";
}
