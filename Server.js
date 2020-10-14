/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');

const PORT = 8081;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Listening');
});

app.get('/currentLocationWeather', (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lon;
  const API_KEY = "ab5f43553f9630945af0a4a8c0c3e4f2";

  if (
    latitude === undefined ||
    latitude === null ||
    latitude.trim() === '' ||
    longitude === undefined ||
    longitude === null ||
    longitude.trim() === ''
  ) {
    res.status(400).send('Please provide a valid latitude and/ or longitude');
    return;
  }
  let darkSkyURL = `https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}`;
  darkSkyURL = encodeURI(darkSkyURL);
  request.get({ url: darkSkyURL }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      return res.status(200).send(body);
    }
    return res.status(404).send('The requested data could not be found');
  });
});

app.get('/autoComplete', (req, res) => {
  const { city } = req.query;
  if (city === undefined || city === null || city.trim() === '') {
    res.status(400).send('Bad request: Please enter at least one character');
    return;
  }
  request.get(
    {
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${city}&types=(cities)&language=en&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0`,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        return res.status(200).send(body);
      }
      return res.status(404).send('The requested data could not be found');
    }
  );
});

app.get('/searchLocationWeather', (req, res) => {
  const { street, city, state } = req.query;
  if (
    street === undefined ||
    city === undefined ||
    state === undefined ||
    street.trim() === '' ||
    city.trim() === '' ||
    state.trim() === '' ||
    street === null ||
    city === null ||
    state === null
  ) {
    res
      .status(400)
      .send(
        'Bad request: Please enter your Street, city and/ or state fields and try again'
      );
    return;
  }

  let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${street},${city},${state}&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0`;
  geocodeURL = encodeURI(geocodeURL);

  // eslint-disable-next-line consistent-return
  request.get({ url: geocodeURL }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      if (data.status === 'OK') {
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;
        let darkySkyURL = `https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/${latitude},${longitude}`;
        darkySkyURL = encodeURI(darkySkyURL);
        request.get(
          { url: darkySkyURL },
          (weatherDataError, weatherDataResponse, weatherDataBody) => {
            if (!weatherDataError && weatherDataResponse.statusCode === 200) {
              return res.status(200).send(weatherDataBody);
            }
            return res
              .status(404)
              .send('The requested data could not be found');
          }
        );
      } else {
        return res.status(200).send('error');
      }
    } else {
      return res.status(404).send('The requested data could not be found');
    }
  });
});

app.get('/stateSeal', (req, res) => {
  const { state } = req.query;
  if (state === undefined || state === null || state.trim() === '') {
    res
      .status(400)
      .send(
        'Bad request: Please enter the state for which the seal is required'
      );
    return;
  }
  const sealSearchURL = `https://www.googleapis.com/customsearch/v1?q=${state}%20state%20seal&cx=005895356040263599874:metybryumto&imgSize=huge&num=1&searchType=image&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0`;
  request.get({ url: sealSearchURL }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      return res.status(200).send(data);
    }
    return res.status(404).send('The requested data could not be found');
  });
});

app.get('/cityImages', (req, res) => {
  const { city } = req.query;
  if (city === null || city === undefined || city.trim() === '') {
    res.status(400).send('Bad request: Please enter a valid city name');
    return;
  }
  let cityImageSearchURL = `https://www.googleapis.com/customsearch/v1?q=${city}&cx=005895356040263599874:metybryumto&num=8&searchType=image&key=AIzaSyAPBlAEy3QbTBuA3rkqRd4UAb9AophJVm0`;
  cityImageSearchURL = encodeURI(cityImageSearchURL);
  request.get({ url: cityImageSearchURL }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      return res.status(200).send(data);
    }
    return res.status(404).send('The requested data could not be found');
  });
});

app.get('/modalWeather', (req, res) => {
  const { latitude } = req.query;
  const { longitude } = req.query;
  const { timeStamp } = req.query;
  if (
    latitude === undefined ||
    latitude === null ||
    latitude.trim() === '' ||
    longitude === undefined ||
    longitude === null ||
    longitude.trim() === '' ||
    timeStamp === undefined ||
    timeStamp === null ||
    timeStamp.trim() === ''
  ) {
    res
      .status(400)
      .send(
        'Bad request: Please enter a valid latitude, longitude and/ or timestamp'
      );
    return;
  }
  let searchURL = `https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/${latitude},${longitude},${timeStamp}`;
  searchURL = encodeURI(searchURL);
  request.get({ url: searchURL }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      return res.status(200).send(body);
    }
    return res.status(404).send('The requested data could not be found');
  });
});

app.get('/favWeather', (req, res) => {
  const { latitude } = req.query;
  const { longitude } = req.query;
  if (
    latitude === undefined ||
    latitude === null ||
    latitude.trim() === '' ||
    longitude === undefined ||
    longitude === null ||
    longitude.trim() === ''
  ) {
    res
      .send(400)
      .send('Bad request: Please enter a valid latitude and/ or longitude');
    return;
  }
  let weatherSearchURL = `https://api.darksky.net/forecast/ab5f43553f9630945af0a4a8c0c3e4f2/${latitude},${longitude}`;
  weatherSearchURL = encodeURI(weatherSearchURL);
  request.get({ url: weatherSearchURL }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      return res.status(200).send(body);
    }
    return res.status(404).send('The requested data could not be found');
  });
});

app.listen(PORT, () => {});
