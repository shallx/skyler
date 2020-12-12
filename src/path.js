const path = require('path');

module.exports = {
  src: function(ext){
    return path.resolve(__dirname + '/templates/fetch_files/'+ ext || '')
  },
  des: process.cwd()
}