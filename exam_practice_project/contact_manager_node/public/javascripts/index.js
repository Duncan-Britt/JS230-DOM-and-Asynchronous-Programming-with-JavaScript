'use_strict';

(function() {
  document.addEventListener("DOMContentLoaded", () =>  {
    fetch("/api/contacts", { method: "GET" })
    .then(response => response.json())
    .then(contacts => App.run(Contacts.create(contacts)));
  });

  const App = {
    run(initialContacts) {
      this.state = State.start(initialContacts);
      this.display = new Display(this.state);

      this.state = this.state.update({ handlers: { searchHandler } });
      this.display.syncState(this.state);

      document.addEventListener("click", clickHandler);
    },
  };

  const searchHandler = function(event) {
    event.preventDefault();

    this.state = this.state.update({
      searchTerm: event.target.value,
      pageName: "dynamic",
    });

    this.display.syncState(this.state);
  }.bind(App);

  const addHandler = function(event) {
    event.preventDefault();

    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: pipe(event.target,
                 form => new FormData(form).entries(),
                 Object.fromEntries,
                 JSON.stringify)})
    .then(() => fetch("/api/contacts", { method: "GET" }))
    .then(response => response.json())
    .then(contacts => {
      let changes = {
        contacts: Contacts.create(contacts),
        pageName: "contacts_template",
        handlers: { searchHandler },
        flash: "Contact Created",
      };
      this.state = this.state.update(changes);
      this.display.syncState(this.state);
    });
  }.bind(App);

  const editHandler = function(event) {
    event.preventDefault();

    const id = event.target.dataset.id;
    fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: pipe(event.target,
                 form => new FormData(form).entries(),
                 Object.fromEntries,
                 JSON.stringify)})
    .then(() => fetch("/api/contacts", { method: "GET" }))
    .then(response => response.json())
    .then(contacts => {
      let changes = {
        contacts: Contacts.create(contacts),
        pageName: "contacts_template",
        handlers: { searchHandler },
      };
      this.state = this.state.update(changes);
      this.display.syncState(this.state);
    });
  }.bind(App);

  const clickHandler = function(event) {
    if (event.target.nodeName !== 'A') return;

    event.preventDefault();
    let path = event.target.href.match(/#?\w+$/)[0];
    let changes = {};

    switch (path) {
      case "edit_template":
        changes.pageName = path;
        changes.contact_id = event.target.dataset.id;
        changes.handlers = { editHandler };
        this.state = this.state.update(changes);
        this.display.syncState(this.state);
        break;

      case "#delete":
        if (!window.confirm("Do you want to delete the contact?")) return;

        const id = event.target.dataset.id;
        fetch(`/api/contacts/${id}`, { method: "DELETE" })
        .then(() => fetch("/api/contacts", { method: "GET" }))
        .then(response => response.json())
        .then(contacts => {
          changes.contacts = Contacts.create(contacts);
          changes.flash = "Contact Deleted";
          this.state = this.state.update(changes);
          this.display.syncState(this.state);
        });
        break;

      case "contacts_template":
        changes.pageName = path;
        changes.handlers = { searchHandler };
        this.state = this.state.update(changes);
        this.display.syncState(this.state);
        break;

      case "add_template":
        changes.pageName = path;
        changes.handlers = { addHandler };
        this.state = this.state.update(changes);
        this.display.syncState(this.state);
        break;

      case "clear":
        changes.filters = [];
        changes.tags = [];
        changes.handlers = { searchHandler };
        this.state = this.state.update(changes);
        this.display.syncState(this.state);
        break;

      default: // TAGS
        changes.filters = [contact => {
          return contact.tags.includes(event.target.text.slice(1));
        }].concat(this.state.filters);

        changes.tags = this.state.tags.concat(event.target.text.slice(1));

        this.state = this.state.update(changes);
        this.display.syncState(this.state);
        break;
    }
  }.bind(App);

  class Contact {
    constructor(contactData) {
      Object.assign(this, contactData);
      if (this.tags) {
        this.tags = this.tags.split(",");
      } else {
        this.tags = [];
      }
    }

    static create(contactData) {
      return new Contact(contactData);
    }
  }

  class Contacts {
    constructor(contactData) {
      Object.assign(this, []);

      contactData.forEach(contact => {
        this[contact.id] = Contact.create(contact);
      });
    }

    static create(contactData) {
      return new Contacts(contactData);
    }

    push(contact) {
      this[contact.id] = contact;
    }

    forEach(callback) {
      for (let id in this) {
        if (this.hasOwnProperty(id)) {
          callback(this[id]);
        }
      }
    }

    filter(callback) {
      const contacts = new Contacts([]);

      this.forEach(contact => {
        if (callback(contact)) {
          contacts.push(contact);
        }
      });

      return contacts;
    }
  }

  class Display {
    constructor(state) {
      document.body.innerHTML = state.page.create(state);

      document.querySelector("#main_header input")
      .addEventListener("keyup", state.handlers.searchHandler);
    }

    syncState(state) {
      switch (state.page) {
        case state.pages.add_template:
          document.body.innerHTML = state.page.create(state);
          document.querySelector("form")
          .addEventListener("submit", state.handlers.addHandler);
          break;

        case state.pages.edit_template:
          document.body.innerHTML = state.page.create(state);
          document.querySelector("form")
          .addEventListener("submit", state.handlers.editHandler);
          break;

        case state.pages.contacts_template:
          document.body.innerHTML = state.page.create(state);
          const input = document.querySelector("#main_header input");
          input.addEventListener("keyup", state.handlers.searchHandler);
          break;

        case state.pages.dynamic:
          document.querySelector("#contact_section")
          .innerHTML = state.page.create(state);
          break;
      }

      // debugger;
      if (state.flash) {
        const flashP = el("p", { class: "flash_success" }, state.flash);
        document.querySelector("header").appendChild(flashP);
        setTimeout(() => {
          flashP.remove();
        }, 5000);
      }
    }
  }

  class Page {
    constructor(templateFunction) {
      this.create = state => {
        switch (state.page) {
          case state.pages.edit_template:
            return templateFunction(state.contact);
            break;
          case state.pages.add_template:
            return templateFunction({});
            break;
          case state.pages.contacts_template:
            return templateFunction({
              contacts: state.contacts,
              tags: state.tags,
              searchTerm: state.searchTerm,
            });
            break;
          case state.pages.dynamic:
            return templateFunction({
              contacts: state.contacts,
              tags: state.tags,
            });
            break;
        }
      }
    }
  }

  class State {
    constructor(contacts, page, contact, handlers, filters, tags, searchTerm, flash) {
      this._contacts = contacts;
      this.page = page;
      this.contact = contact;
      this.handlers = handlers;
      this.filters = filters;
      this.tags = tags;
      this.searchTerm = searchTerm;
      this.flash = flash;
    }

    get contacts() {
      return this.filters.reduce((contacts, cb) => {
        return contacts.filter(cb);
      }, this._contacts)
      .filter(contact => {
        return contact.full_name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }

    static start(contacts) {
      document.querySelectorAll(".partial").forEach(partial => {
        Handlebars.registerPartial(partial.id, partial.innerHTML);
      });

      const pages = {};
      document.querySelectorAll(".template").forEach(template => {
        pages[template.id] = new Page(Handlebars.compile(template.innerHTML));
      });

      State.prototype.pages = pages;

      return new State(contacts, pages.contacts_template, null, {}, [], [], '');
    }

    update(changes) {
      const page = changes.pageName ? this.pages[changes.pageName] : this.page;
      const contacts = changes.contacts || this._contacts;
      const handlers = changes.handlers || this.handlers;
      const filters = changes.filters || this.filters;
      const tags = changes.tags || this.tags;
      const flash = changes.flash;

      let contact;
      if (changes.contact_id !== undefined) {
        contact = this._contacts[changes.contact_id];
      } else {
        contact = this.contact;
      }

      let searchTerm;
      if (changes.hasOwnProperty("searchTerm")) {
        searchTerm = changes.searchTerm;
      } else {
        searchTerm = this.searchTerm || '';
      }

      return new State(contacts, page, contact, handlers, filters, tags, searchTerm, flash);
    }
  }

  function pipe(arg, ...[f, ...t]) {
    return t.length == 0 ? f(arg) : pipe(f(arg), ...t);
  }

  function el(name, attrs, text) {
    const element = document.createElement(name);
    Object.keys(attrs).forEach(attr => element.setAttribute(attr, attrs[attr]));
    if (text) {
      element.textContent = text;
    }
    return element;
  }
}());
