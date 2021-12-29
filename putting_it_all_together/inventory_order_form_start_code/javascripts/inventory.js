var inventory;

function closest(el, selector) {
  const parent = el.parentElement;
  if (parent === document) {
    return parent.matches(selector) ? parent : null;
  }

  return parent.matches(selector) ? parent : closest(parent, selector);
}

function createElementFromHTML(htmlString) {

}

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      document.querySelector('#order_date').textContent = date.toUTCString();
    },
    cacheTemplate: function() {
      var iTmpl = document.querySelector('#inventory_item');
      iTmpl.remove();
      this.template = Handlebars.compile(iTmpl.innerHTML);
    },
    add: function() {
      this.lastId++;
      var item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item);

      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      var found_item;

      this.collection.forEach(function(item) {
        if (item.id == id) {
          found_item = item;
          return false;
        }
      });

      return found_item;
    },
    update: function(itemEl) {
      var id = this.findID(itemEl),
          item = this.get(id);

      item.name = itemEl.querySelector("[name^=item_name]").value;
      item.stock_number = itemEl.querySelector("[name^=item_stock_number]").value
      item.quantity = itemEl.querySelector("[name^=item_quantity]").value;
    },
    newItem: function(e) {
      e.preventDefault();
      var item = this.add();
      var itemEl = document.createElement('tr');
      itemEl.innerHTML = this.template({id: item.id});
      document.querySelector('#inventory').appendChild(itemEl);
    },
    findParent: function(e) {
      return closest(e.target, 'tr');
    },
    findID: function(item) {
      return item.querySelector('input[type=hidden]').value;
    },
    deleteItem: function(e) {
      e.preventDefault();
      var item = this.findParent(e);
      item.remove();
      this.remove(this.findID(item));
    },
    updateItem: function(e) {
      var item = this.findParent(e);
      this.update(item);
    },
    bindEvents: function() {
      document.querySelector('#add_item')
              .addEventListener('click', this.newItem.bind(this));
      const inventory = document.querySelector('#inventory');
      const fn = this.deleteItem.bind(this);
      inventory.addEventListener('click', function(e) {
        if (e.target.matches("a.delete")) {
          return fn(e);
        }
      });

      const fn2 = this.updateItem.bind(this);
      inventory.addEventListener('focusout', fn2);
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  inventory.init();
});
