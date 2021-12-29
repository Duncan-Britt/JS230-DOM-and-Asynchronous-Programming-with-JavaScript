// document.addEventListener('DOMContentLoaded', () => {
//   function alterText(e) {
//     e.target.parentElement.classList.toggle('active');
//
//     let command = e.target.dataset.command;
//     if (command === 'createLink') {
//       let url = prompt("Enter the URL link to:");
//       if (url.length > 0) {
//         document.execCommand(command, false, url);
//       } else {
//         alert("Error. URL must contain at least one character");
//       }
//     } else {
//       document.execCommand(command);
//     }
//   }
//
//   document.querySelectorAll('i').forEach(icon => icon.addEventListener('click', alterText));
// });


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('i').forEach(icon => {
    icon.addEventListener('click', e => {
      let command = e.target.dataset.command;
      document.execCommand(command);
      document.querySelector('#edit-window').focus();
    })
  });
});
