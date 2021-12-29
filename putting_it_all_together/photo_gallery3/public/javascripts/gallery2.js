document.addEventListener('DOMContentLoaded', () => {
  // TEMPLATES
  const photosTemplate = Handlebars.compile(
    document.querySelector('#photos').innerHTML
  );

  const photosInfoTemplate = Handlebars.compile(
    document.querySelector('#photo_information').innerHTML
  );

  const commentsTemplate = Handlebars.compile(
    document.querySelector('#photo_comments').innerHTML
  );

  Handlebars.registerPartial(
    'photo_comment',
    document.querySelector('#photo_comment').innerHTML
  )

  // REQUEST PHOTOS DATA
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/photos');
  xhr.responseType = 'json';

  // PHOTOS DATA LOADED
  xhr.addEventListener('load', () => {
    const photosData = xhr.response;
    document.querySelector('#slides')
            .innerHTML = photosTemplate({ photos: photosData });

    let photoIdx = 0;
    const rightArrow = document.querySelector('.next');
    const leftArrow = document.querySelector('.prev');
    let likeButton;
    let favButton;

    // FUNCTIONS
    const bindEventListeners = () => {
      likeButton.addEventListener('click', e => {
        e.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/photos/like');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          console.log(xhr.status)
          console.log(xhr.response);
          likeButton.textContent = likeButton
                                     .textContent
                                     .replace(/\d/, xhr.response.total);

        });
        xhr.send("photo_id="+likeButton.dataset.id);
      });

      favButton.addEventListener('click', e => {
        e.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/photos/favorite');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          favButton.textContent = favButton
                                     .textContent
                                     .replace(/\d/, xhr.response.total);

        });
        xhr.send("photo_id="+favButton.dataset.id);
      });
    };

    const renderPhotoInfo = () => {
      const photoId = photosData[photoIdx]['id'];
      document.querySelector('section header')
              .innerHTML = photosInfoTemplate(photosData[photoIdx]);

      const figures = document.querySelectorAll('#slides figure');
      // Hide all figures
      [].forEach.call(figures, fig => fig.className = 'hide');
      // Show the relevant figure
      [].filter.call(figures, fig => fig.dataset.id == photoId)[0]
        .className = 'show';

      [ likeButton, favButton ] = document.querySelectorAll('.actions a');

      // REQUEST AND RENDER COMMENTS
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/comments?photo_id=' + photoId);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        const commentInfo = xhr.response

        document.querySelector('#comments ul')
                .innerHTML = commentsTemplate({ comments: commentInfo });
      });
      xhr.send();

      bindEventListeners();
    };

    // FIXED EVENT LISTENERS
    rightArrow.addEventListener('click', () => {
      photoIdx = mod(photoIdx + 1, photosData.length);

      renderPhotoInfo();
    });

    leftArrow.addEventListener('click', () => {
      photoIdx = mod(photoIdx - 1, photosData.length);

      renderPhotoInfo();
    });

    // INITIALIZE
    renderPhotoInfo();
  });
  xhr.send();
});


// HELPER FUNCTIONS
function mod(a, b) {
  return (a % b + b) % b;
}
