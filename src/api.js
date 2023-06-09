const axios = require("axios");
const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;
const githubToken = process.env.GITHUB_TOKEN;

const trelloUrl = "https://api.trello.com/1/";
const trelloParams = {
  key,
  token,
};

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
      .post(trelloUrl + "cards", {
        name: name,
        idList: "5fc37294869f4a07606ae4b2",
        ...trelloParams,
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
      .get(trelloUrl + "lists/" + listId + "/cards", { params: trelloParams })
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
        console.log(err);
        reject("Some error occured!!!");
      });
  });
};
const updateCard = async (id, desc) => {
  return new Promise((resolve, reject) => {
    axios
      .put(trelloUrl + "cards/" + id, {
        desc,
        ...trelloParams,
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
      .delete(trelloUrl + "cards/" + id, { params: trelloParams })
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
      .put(trelloUrl + "cards/" + id, {
        idList: "5fc37294869f4a07606ae4b3",
        ...trelloParams,
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

const getTiktokVideoDownloadUrl = async (url) => {
  try {
    const result = await axios.get(
      "https://api.akuari.my.id/downloader/tiktok",
      {
        params: {
          link: url,
        },
      }
    );
    const link = result.data.respon.video;
    return link;
    
  }
  catch(error){
    console.log(error)
  }
}

const dlVideo = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "stream",
    });

    // const totalSize = response.headers["content-length"];
    // let downloadedSize = 0;

    const filename = `./video_${Date.now()}.mp4`;

    const writer = fs.createWriteStream(filename);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
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
  getTiktokVideoDownloadUrl,
  dlVideo
};
