const axios = require('axios');

require("dotenv").config();

const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

const createCard = async(name) => {
  try {
    const result = await axios.post('https://api.trello.com/1/cards', {
      name : name,
      idList : "5fc37294869f4a07606ae4b2",
      key: key,
      token : token
    });
    return result;
  }
  catch(err){
    console.log(err);
  }
}

const getCards = async() => {
  try {
    const result =await axios.get('https://api.trello.com/1/lists/5fc37294869f4a07606ae4b2/cards', {
      params: {
        key: "1a2d8146bad80cf8489c4f3fe1ccd62b",
        token : "4ec2e42aae54caba0a651ac17d05c7d0ad875f0233ce0ee6b7070be4e92a892a"
      }
    });
    return result.data.map((val,i) => {
      return {
        name : val.name,
        id: val.id
      }
    });

  }
  catch(err){
    console.log("Some error occured in the API");
  }
}

const removeCard = async(id) => {
  try {
    const result =await axios.delete('https://api.trello.com/1/cards/'+id, {
      params: {
        key: "1a2d8146bad80cf8489c4f3fe1ccd62b",
        token : "4ec2e42aae54caba0a651ac17d05c7d0ad875f0233ce0ee6b7070be4e92a892a"
      }
    });
    return "Success!!!";

  }
  catch(err){
    console.log(err);
  }
}

// createCard("Sleep late");

module.exports = {
  createCard,
  getCards,
  removeCard
}