const mongoose = require('mongoose');

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((req, res) => {
    console.log('database connection successful');
}).catch(err => {
    // res.status(500).send(err.message);
    console.log(err, 'database connection unsuccessful');
    throw err;
})

module.exports = mongoose;