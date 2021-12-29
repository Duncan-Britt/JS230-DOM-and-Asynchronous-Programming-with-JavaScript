let CONSOLE;
document.addEventListener("DOMContentLoaded", () => {
  const modalTemplate = Handlebars.compile(
                          document.querySelector('#modalTemplate').innerHTML);
  const html = modalTemplate({});
  document.querySelector('#modal').innerHTML = html;

  // DOM ELEMENTS
  const teamDiv = document.querySelector('#team');
  const tMemberLinks = document.querySelectorAll('#team ul li a');

  const div = document.createElement('div');
  div.id = "modal";

  teamDiv.addEventListener('click', e => {
    e.preventDefault();

    const modal = document.getElementById('modal');
    let src;
    let name;
    if (e.target.tagName === 'A') {
      src = e.target.querySelector('img').src;
      name = e.target.lastChild.textContent;
    } else if (e.target.tagName === 'IMG') {
      src = e.target.src;
      name = e.target.nextSibling.textContent;
    }

    const html = modalTemplate({name, src});
    document.querySelector('#modal').innerHTML = html;

    modal.style.visibility = 'visible';

    document.querySelector('.close').addEventListener('click', e => {
      e.preventDefault();
      modal.style.visibility = 'hidden';
    });
  });
});
