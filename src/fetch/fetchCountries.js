const url = 'https://restcountries.eu/rest/v2/name/';

export default function fetchCountries(searchQuery) {
  const countryInput = url + searchQuery;
  return fetch(countryInput).then(response => {
    return response.json();
  });
}