// Initial Steps
// - compile templates
// - load photos data
//   - bind fixed event listeners
//   - render initial photo + data + commetns
//     - bind event listeners
//
// Recurring steps
//   - rerender photo + data + comments
//     - bind event listeners
let CONSOLE;
document.addEventListener('DOMContentLoaded', () => {
  Templates.compile();
  GalleryManager.init();
});

const Templates = {
  compile() {
    this.photos = Handlebars.compile(
      document.querySelector('#photos').innerHTML
    );

    this.info = Handlebars.compile(
      document.querySelector('#photo_information').innerHTML
    );

    this.comments = Handlebars.compile(
      document.querySelector('#photo_comments').innerHTML
    );

    Handlebars.registerPartial(
      'photo_comment',
      document.querySelector('#photo_comment').innerHTML
    )
  },
};

const GalleryManager = {
  bindEventListeners() {
    this.likeButton.addEventListener('click', e => {
      e.preventDefault();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/photos/like');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        this.likeButton.textContent = this.likeButton
                                          .textContent
                                          .replace(/\d/, xhr.response.total);

      });
      xhr.send("photo_id="+this.likeButton.dataset.id);
    });

    this.favButton.addEventListener('click', e => {
      e.preventDefault();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/photos/favorite');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        this.favButton.textContent = this.favButton
                                         .textContent
                                         .replace(/\d/, xhr.response.total);

      });
      xhr.send("photo_id="+this.favButton.dataset.id);
    });
  },

  renderPhotosInfo(photosData) {
    this.photoId = photosData[this.photoIdx]['id'];
    document.querySelector('section header')
            .innerHTML = Templates.info(photosData[this.photoIdx]);

    const figures = document.querySelectorAll('#slides figure');
    // Hide all figures
    [].forEach.call(figures, fig => fig.className = 'hide');
    // Show the relevant figure
    [].filter.call(figures, fig => fig.dataset.id == this.photoId)[0]
      .className = 'show';

    [ this.likeButton, this.favButton ] = document.querySelectorAll('.actions a');

    // REQUEST AND RENDER COMMENTS
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/comments?photo_id=' + this.photoId);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      const commentInfo = xhr.response
      this.comments = { comments: commentInfo };
      document.querySelector('#comments ul')
              .innerHTML = Templates.comments(this.comments);
    });
    xhr.send();

    this.bindEventListeners();
  },

  init() {
    this.photoIdx = 0;

    // LOAD PHOTOS DATA
    loadPhotosData(photosData => {
      this.photoId = photosData[this.photoIdx]['id'];
      document.querySelector('#slides')
              .innerHTML = Templates.photos({ photos: photosData });

      // FIXED EVENT LISTENERS
      // right arrow
      document.querySelector('.next').addEventListener('click', () => {
        this.photoIdx = mod(this.photoIdx + 1, photosData.length);

        this.renderPhotosInfo(photosData);
      });
      // left arrow
      document.querySelector('.prev').addEventListener('click', () => {
        this.photoIdx = mod(this.photoIdx - 1, photosData.length);

        this.renderPhotosInfo(photosData);
      });
      // new comment submit
      document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/comments/new');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          this.comments.comments.push(xhr.response);
          document.querySelector('#comments ul')
                  .insertAdjacentHTML(
                    'beforeend',
                    Templates.comments({ comments: [xhr.response] })
                  );
        });
        let data = new FormData(form);
        data.set('photo_id', this.photoId);
        xhr.send(new URLSearchParams([...data]));
      });

      this.renderPhotosInfo(photosData);
    });
  },
}

// HELPER FUNCTIONS
function loadPhotosData(loadHandler) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/photos');
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => loadHandler(xhr.response));
  xhr.send();
}

function mod(a, b) {
  return (a % b + b) % b;
}
