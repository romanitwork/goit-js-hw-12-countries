import './styles.css';
import fetchCountries from './fetch/fetchCountries';
import template from './templates/template.hbs';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';

const debounce = require('lodash.debounce');

const refs = {
  searchForm: document.querySelector('#search-form'),
  output: document.querySelector('.output'),
  outputList: document.querySelector('.output-list'),
};

const makeMarkup = debounce(function input() {
  clearOutput();
  PNotify.closeAll();
  const searchValue = refs.searchForm.elements.search.value;
  if (searchValue === '') {
    clearOutput();
    return;
  }
  fetchCountries(searchValue)
    .then(data => {
      if (data.length > 5) {
        PNotify.error({
          text: 'Too many matches found. Please enter a more specisic query!',
        });
        clearOutput();
      } else if (data.length > 1 && data.length < 5) {
        data.map(country => {
          refs.outputList.insertAdjacentHTML(
            'beforeend',
            `<li>${country.name}</li>`,
          );
        });
        refs.output.innerHTML = '';
        PNotify.closeAll();
      } else if (data.length === 1) {
        const finalTemplate = template(data);
        console.log(finalTemplate)
        refs.output.insertAdjacentHTML('beforeend', finalTemplate);
        refs.outputList.innerHTML = '';
        PNotify.closeAll();
      }
    })
    .catch(error => console.log('Error: ', error));
}, 500);

refs.searchForm.addEventListener('input', makeMarkup);

function clearOutput() {
  refs.outputList.innerHTML = '';
  refs.output.innerHTML = '';
}
