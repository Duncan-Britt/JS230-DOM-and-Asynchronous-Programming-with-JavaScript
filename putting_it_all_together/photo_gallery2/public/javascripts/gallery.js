document.addEventListener("DOMContentLoaded", () => {
  // TEMPLATES
  const template = Handlebars.compile(
    document.getElementById('photos').innerHTML
  );
  const commentsTemplate = Handlebars.compile(
    document.getElementById('photo_comments').innerHTML
  );
  const photoInfoTemplate = Handlebars.compile(
    document.querySelector('#photo_information').innerHTML
  );
  Handlebars.registerPartial(
    "photo_comment",
    document.getElementById('photo_comment').innerHTML
  );

  // INITIAL PAGE LOAD REQUEST PHOTOS & FIRST PHOTO COMMENTS
  const xhrPhotos = new XMLHttpRequest();
  xhrPhotos.open('GET', 'http://localhost:3000/photos');
  xhrPhotos.responseType = 'json';
  xhrPhotos.addEventListener('load', _ => {
    document.getElementById('slides').innerHTML = template({
      photos: xhrPhotos.response
    });

    let photo = xhrPhotos.response.filter(function(item) {
      return item.id === 1;
    })[0];
    document.querySelector('section > header')
            .innerHTML = photoInfoTemplate(photo);

    const id = xhrPhotos.response[0].id;
    const xhrComments = new XMLHttpRequest();
    xhrComments.open('GET', 'http://localhost:3000/comments?photo_id=' + id);
    xhrComments.responseType = 'json';
    xhrComments.addEventListener('load', _ => {
      document.querySelector('#comments ul').innerHTML = commentsTemplate({
        comments: xhrComments.response
      });
    });
    xhrComments.send();

    // NEW LIKE SUBMISSION
    document.querySelector('.like').addEventListener('click', e => {
      e.preventDefault();

      const xhrLike = new XMLHttpRequest();
      xhrLike.open('POST', 'http://localhost:3000/photos/like');
      xhrLike.setRequestHeader("Content-Type", "application/json");
      xhrLike.responseType = 'json'
      xhrLike.addEventListener('load', _ => {
        photo.likes = xhrLike.response.total;
        document.querySelector('section > header')
                .innerHTML = photoInfoTemplate(photo);
      });
      xhrLike.send(JSON.stringify({ photo_id: id }));
    });
  });
  xhrPhotos.send();

  // NEXT SLIDE
  let photoIdx = 0;
  document.querySelector('.next').addEventListener('click', _ => {
    [].forEach.call(document.querySelectorAll('#slides figure'), fig => {
      fig.classList.remove('show');
      fig.classList.add('hide');
    });

    photoIdx = mod(photoIdx + 1, 3);
    document.querySelectorAll('#slides figure')[photoIdx]
            .classList.add('show');

    let photo = xhrPhotos.response.filter(function(item) {
      return item.id === 0;
    })[photoIdx];
    document.querySelector('section > header')
            .innerHTML = photoInfoTemplate(photo);

    const id = xhrPhotos.response[photoIdx].id;
    const xhrComments = new XMLHttpRequest();
    xhrComments.open('GET', 'http://localhost:3000/comments?photo_id=' + id);
    xhrComments.responseType = 'json';
    xhrComments.addEventListener('load', _ => {
      document.querySelector('#comments ul').innerHTML = commentsTemplate({
        comments: xhrComments.response
      });
    });
    xhrComments.send();
  });

  // PREVIOUS SLIDE
  document.querySelector('.prev').addEventListener('click', _ => {
    [].forEach.call(document.querySelectorAll('#slides figure'), fig => {
      fig.classList.remove('show');
      fig.classList.add('hide');
    });

    photoIdx = mod(photoIdx - 1, 3);
    document.querySelectorAll('#slides figure')[photoIdx]
            .classList.add('show');

    let photo = xhrPhotos.response.filter(function(item) {
      return item.id === 0;
    })[photoIdx];
    document.querySelector('section > header')
            .innerHTML = photoInfoTemplate(photo);

    const id = xhrPhotos.response[photoIdx].id;
    const xhrComments = new XMLHttpRequest();
    xhrComments.open('GET', 'http://localhost:3000/comments?photo_id=' + id);
    xhrComments.responseType = 'json';
    xhrComments.addEventListener('load', _ => {
      document.querySelector('#comments ul').innerHTML = commentsTemplate({
        comments: xhrComments.response
      });
    });
    xhrComments.send();
  });

  // // NEW COMMENT SUBMISSION
  // document.querySelector('#comments form').addEventListener('submit', e => {
  //   e.preventDefault();
  //
  //   const xhrNewComment = new XMLHttpRequest();
  //   xhrNewComment.open('POST', 'http://localhost:3000/comments/new');
  //   xhrNewComment.responsetype = 'json'
  //   xhrNewComment.addEventListener('load', _ => {
  //     console.log(xhrNewComment.response);
  //   });
  //   xhrNewComment.send();
  // });
});

function mod(a, b) {
  return (a % b + b) % b;
}
