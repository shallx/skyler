const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

axios.defaults.baseURL = 'https://api.trello.com/1/';
axios.defaults.params = {
  key,
  token
}

const createCard = async(name) => {
  return new Promise(async(resolve, reject) => {
    axios.post('cards', {
      name : name,
      idList : "5fc37294869f4a07606ae4b2",
    })
    .then(result => {
      return resolve(result);
    })
    .catch(err =>{
      reject("Some error occured");
    })
  })
}

const getCards = async() => {
  return new Promise((resolve,reject) => {
    axios.get('lists/5fc37294869f4a07606ae4b2/cards')
      .then(result => {
        const mapped_result = result.data.map((val,i) => {
          return {
            name : val.name,
            id: val.id
          }
        });
        resolve(mapped_result);
      })
      .catch(err => {
        reject(err);
      })
  });
}

const removeCard = async(id) => {
  return new Promise((resolve, reject) => {
    axios.delete('cards/'+id)
      .then(result => {
        resolve("Success");
      })
      .catch(err =>{
        reject("Some error occured");
      });
  });
}

module.exports = {
  createCard,
  getCards,
  removeCard
}