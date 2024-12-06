require('dotenv').config();
const axios = require('axios');

const API_TOKEN = process.env.API_TOKEN;
const DNI = '71051559'; // Reemplaza con el DNI que deseas consultar

const config = {
  method: 'get',
  url: `https://dniruc.apisperu.com/api/v1/dni/${DNI}?token=${API_TOKEN}`,
  headers: {
    'Accept': 'application/json'
  }
};

axios(config)
  .then(response => {
    console.log('Datos obtenidos:', response.data);
  })
  .catch(error => {
    console.error('Error al realizar la consulta:', error);
  });