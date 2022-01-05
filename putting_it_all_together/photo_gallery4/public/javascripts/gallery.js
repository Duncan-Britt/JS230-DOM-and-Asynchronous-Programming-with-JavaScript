let photosAreLoaded = false;
let domIsReady = false;
let photos;

const initialRequest = new XMLHttpRequest();
initialRequest.open('GET', '/photos');
initialRequest.responseType = 'json';
initialRequest.addEventListener('load', () => {
  if (domIsReady) {
    photos = initialRequest.response
    App.init(photos);
  } else {
    photosAreLoaded = true;
    photos = initialRequest.response;
  }
});
initialRequest.send();

document.addEventListener("DOMContentLoaded", () => {
  if (photosAreLoaded) {
    App.init(photos);
  } else {
    domIsReady = true;
  }
});

const App = {
  init(photos) {
    this.currentIdx = 0;
    this.photos = photos;
    Handlebars.registerPartial('photo_comment',
      document.querySelector('#photo_comment').innerHTML);

    this.slidesDiv = document.querySelector('#slides');
    this.slidesDiv.innerHTML = Handlebars.compile(
      document.querySelector("#photos").innerHTML)({ photos: this.photos });

    this.photoInfoTemplate = Handlebars.compile(
      document.querySelector('#photo_information').innerHTML);

    this.commentsTemplate = document.querySelector('#photo_comments').innerHTML;
    this.commentsUl = document.querySelector('#comments ul');

    this.infoHeader = document.querySelector('section header');

    this.photoElements = document.querySelectorAll('#slides figure');

    document.querySelector('.prev').addEventListener('click', this.left.bind(this));
    document.querySelector('.next').addEventListener('click', this.right.bind(this));

    this.renderDOM();
  },

  renderDOM() {
    let id = this.photos[this.currentIdx].id;
    currentPhotoElement = Array.from(this.photoElements)
      .find(photoEl => photoEl.dataset.id == id);
    currentPhotoElement.classList.remove('hide');
    currentPhotoElement.classList.add('show');

    // LOAD/RENDER COMMENTS
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `comments?photo_id=${id}`);
    xhr.responseType = "json";
    xhr.addEventListener("load", () => {
      this.commentsUl.innerHTML = Handlebars.compile(
        this.commentsTemplate)({comments: xhr.response});
    });
    xhr.send();
    this.infoHeader.innerHTML = this.photoInfoTemplate(this.photos[this.currentIdx]);

    this.bindEventListeners();
  },

  bindEventListeners() {
    document.querySelectorAll('.actions a').forEach(actionLink => {
      let id = actionLink.dataset.id;
      let url = actionLink.href;
      // let type = actionLink.dataset.property;

      actionLink.addEventListener('click', e => {
        e.preventDefault();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          actionLink.textContent = actionLink.textContent.replace(/(\d+)/, xhr.response.total);;
        });

        xhr.send(`photo_id=${id}`);
      });
    });
  },

  hidePhotos() {
    this.photoElements.forEach(fig => {
      fig.classList.remove('show');
      fig.classList.add('hide');
    })
  },

  right() {
    this.hidePhotos();
    this.currentIdx = (this.currentIdx + 1) % photos.length;
    this.renderDOM();
  },

  left() {
    this.hidePhotos();
    this.currentIdx = mod((this.currentIdx - 1), photos.length);
    this.renderDOM();
  },
}

function mod(a, b) {
  return (a % b + b) % b;
}
