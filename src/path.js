const path = require('path');

module.exports = {
  src: function(ext){
    return path.resolve(__dirname + '/templates/projects/'+ ext || '')
  },
  des: process.cwd()
}