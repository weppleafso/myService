var  error = require('../table/error.json');
module.export.error = function(name){
    return error[name];
}