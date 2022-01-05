document.addEventListener("DOMContentLoaded", () => {
  render_todos();
  bind_event_listener();

  document.querySelector('#delete_message > a').addEventListener('click', e => {
    e.preventDefault();
    todo_items.delete(focused_id)
    render_todos();
    bind_event_listener();
    document.querySelector('#delete_message').style.display = "none";
  });

  document.querySelector('#delete_message > a + a').addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('#delete_message').style.display = "none";
  });
});

let focused_id = 0;

todo_items = {
  todos: [
    { id: 1, title: 'Homework' },
    { id: 2, title: 'Shopping' },
    { id: 3, title: 'Calling Mom' },
    { id: 4, title: 'Coffee with John '}
  ],

  delete(id) {
    this.todos = this.todos.filter(todo => todo.id != focused_id);
  },
};

function render_todos() {
  let todos = document.querySelector('ul');
  if (todos) todos.remove();

  document.body
  .insertAdjacentHTML('beforeend',
    Manglebars.compile(
      document.querySelector("#todo_items").innerHTML
    )(todo_items)
  );
}

function bind_event_listener() {
  document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', e => {

    });

    li.querySelector('button').addEventListener('click', () => {
      focused_id = Number(li.dataset.id);
      document.querySelector('#delete_message').style.display = "block";
    });
  });
}
