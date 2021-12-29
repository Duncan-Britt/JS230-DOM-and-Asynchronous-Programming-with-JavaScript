document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

Handlebars.registerHelper('capitalize', function(word) {
  return word[0].toUpperCase() + word.slice(1);
});

Handlebars.registerHelper('makeModel', function(make, model) {
  return make[0].toUpperCase() +
    make.slice(1) + ' ' +
    model[0].toUpperCase() +
    model.slice(1);
});

let CONSOLE;
const App = {
  init() {
    // INIT HEADER
    document.querySelector('header').innerHTML = Handlebars.compile(
      document.querySelector('#header_template').innerHTML)({ filters });

    this.galleryTemplate = Handlebars.compile(
      document.querySelector('#gallery').innerHTML);

    this.modelOptions = distinctOptions('model').map(option => option.value);

    this.filter();
    this.renderPage();

    document.querySelector('header select').addEventListener('change', e => {
      this.make = e.target.value;
      this.filterModelOptionsByMake();
    });

    document.querySelector('#filter').addEventListener('click', () => {
      this.filter();
      this.renderPage();
    });
  },

  filterModelOptionsByMake() {
    const modelSelect = document.querySelector('header select ~ select');
    for (let i = modelSelect.options.length - 1; i >= 0; --i) {
      modelSelect.options[i].remove();
    }

    let modelsByMake = modelsByMakeF(this.make);
    
    ['All'].concat(this.modelOptions.filter(option => modelsByMake.includes(option)))
    .forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.textContent = option;
      modelSelect.options.add(optionElement);
    });
  },

  renderPage() {
    document.querySelector('ul').innerHTML = this.galleryTemplate({ cars: this.cars });
  },

  filter() {
    let formData = new FormData(document.querySelector('form'));
    this.make = formData.get('make');
    this.model = formData.get('model');
    this.price = formData.get('price');
    this.year = formData.get('year');

    this.cars = cars.filter(({ make, model, year, price }) => {
      return (this.make === 'All' || this.make === make) &&
             (this.model === 'All' || this.model === model) &&
             (this.year === 'Any' || this.year == year) &&
             (this.price === 'Any' || this.price == price);
    });
  },
};

const cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

let filters = [ "make", "model", "price", "year"];
filters = filters.map(filter => {
  return {
    filter,
    options: distinctOptions(filter),
  };
});

function modelsByMakeF(make) {
  if (make === 'All') {
    return distinctOptions('model').map(model => model.value);
  } else {
    return distinctOptions('model')
          .map(model => model.value)
          .filter(model => {
            return [{ make: 'All', image: 'None', model: 'All', year: 'Any', price: 'Any' }]
            .concat(cars)
            .filter(car => car.make === make && car.model === model)
            .length > 0;
          });
  }
}

function distinctOptions(key) {
  const result = [];
  [{ make: 'All', image: 'None', model: 'All', year: 'Any', price: 'Any' }]
  .concat(cars).forEach(carData => {
    if(!result.includes(carData[key])) {
      result.push(carData[key])
    }
  });
  return result.map(value => {
    return { value };
  });
}
