document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  startTimer(e) {
    this.timer = setTimeout(() => {
      this.showToolTip(e);
    }, 500);
  },

  showToolTip(e) {
    if (e.target.matches('img')) {
      e.target.nextElementSibling.classList.add('hover');
    }
  },

  handleMouseLeave(e) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (e.target.matches('img')) {
      e.target.nextElementSibling.classList.remove('hover');
    }
  },

  init() {
    const gallery = document.querySelector('#exotic_animals')
    gallery.addEventListener('mouseenter', this.startTimer.bind(this), true);
    gallery.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
  },
};
