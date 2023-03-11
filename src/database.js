const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/administracion')
    .then(db => console.log('Connection completed!'))
    .catch(err=> console.log('Error'));

module.exports= mongoose;