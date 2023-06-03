const axios = require("axios");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;
const githubToken = process.env.GITHUB_TOKEN;

axios.default.baseURL = "https://api.trello.com/1/";
axios.default.params = {
  key,
  token,
};

const list = {
  "To Do": "5fc37294869f4a07606ae4b2",
  Done: "5fc37294869f4a07606ae4b3",
};

const createCard = async (name) => {
  return new Promise(async (resolve, reject) => {
    axios
      .post("cards", {
        name: name,
        idList: "5fc37294869f4a07606ae4b2",
      })
      .then((result) => {
        return resolve(result.data.id);
      })
      .catch((err) => {
        reject("Some error occured!!!");
      });
  });
};

const getCards = async (id) => {
  let listId = id || "5fc37294869f4a07606ae4b2";

  return new Promise((resolve, reject) => {
    axios
      .get("lists/" + listId + "/cards")
      .then((result) => {
        const mapped_result = result.data.map((val, i) => {
          return {
            name: val.name,
            id: val.id,
          };
        });
        resolve(mapped_result);
      })
      .catch((err) => {
        reject("Some error occured!!!");
      });
  });
};
const updateCard = async (id, desc) => {
  return new Promise((resolve, reject) => {
    axios
      .put("cards/" + id, {
        desc,
      })
      .then((result) => {
        resolve("Success!!!");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const removeCard = async (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete("cards/" + id)
      .then((result) => {
        resolve("Task removed successfully!!!");
      })
      .catch((err) => {
        reject("Some error occured");
      });
  });
};

const moveCard = async (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put("cards/" + id, {
        idList: "5fc37294869f4a07606ae4b3",
      })
      .then((result) => {
        resolve("Task completed!!!");
      })
      .catch((err) => {
        reject("Some error occured!!!");
      });
  });
};

const getRepos = async (opt) => {
  let visibility = "all";
  if (opt.all) {
    visibility = "all";
  } else if (opt.private) {
    visibility = "private";
  } else if (opt.public) {
    visibility = "public";
  }
  return new Promise(async (resolve, reject) => {
    axios
      .get("https://api.github.com/user/repos", {
        headers: {
          Authorization: "Bearer " + githubToken,
        },
        params: {
          per_page: 100,
          visibility,
        },
      })
      .then((result) => {
        console.log("Total Results: ", result.data.length);
        const mapped_result = result.data.map((val, i) => {
          return `${i + 1}. ${val.name}`;
        });

        return resolve(mapped_result);
      })
      .catch((err) => {
        reject("Some error occured!!!");
      });
  });
};

const searchRepos = async (val, opt) => {
  try {
    const result = await axios.get(
      "https://api.github.com/search/repositories",
      {
        headers: {
          Authorization: "Bearer " + githubToken,
        },
        params: {
          q: "user:shallx " + val,
          type: "Repositories",
        },
      }
    );
    return result.data.items.map((val, i) => val.full_name);
    
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCard,
  getCards,
  removeCard,
  moveCard,
  updateCard,
  list,
  getRepos,
  searchRepos,
};
