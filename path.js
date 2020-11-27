const path = require('path');

module.exports = {
  src: function(ext){
    return path.resolve(__dirname + '//templates//'+ ext || '')
  },
  des: process.cwd()
}