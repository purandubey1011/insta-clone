let mongoose = require('mongoose')

mongoose
        .connect('mongodb://127.0.0.1:27017/insta_clone')
        .then(()=>console.log('database connected'))
        .catch((err)=>console.log(err))