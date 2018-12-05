var db = require('../fn/mysql-db');
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyB7MZu2VRmZQicd8qcsxGg5jBSegiT0ec0'
  };
   


exports.getAttitude = (Adress) => {
    var geocoder = NodeGeocoder(options);
    return geocoder.geocode(Adress);
}


