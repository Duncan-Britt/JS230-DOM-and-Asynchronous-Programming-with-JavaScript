document.addEventListener('DOMContentLoaded', () => {
  // DOM ELEMENTS
  const featureImg = document.querySelector('figure img');
  const listEl = document.querySelector('ul');

  listEl.addEventListener('click', e => {
    if (e.target.tagName !== 'IMG') {
      return;
    }

    featureImg.src = e.target.src;

    [].forEach.call(listEl.querySelectorAll('img'), img => {
      img.classList.remove('active');
    });

    e.target.classList.add('active');
  });
});
