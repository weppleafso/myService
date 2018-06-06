var  error = require('../table/error.json');
module.exports.getError = function(name){
    return error[name];
}