const path = require('path');

module.exports = {
  fetch_src: function(ext){
    return path.resolve(__dirname + '/templates/fetch_files/'+ ext || '')
  },
  create_src: function(ext){
    return path.resolve(__dirname + '/templates/projects/'+ ext || '')
  },
  des: process.cwd()
}