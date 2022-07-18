const User = require('../models/user')

const register = async (req, res, next) => {
    try {
        console.log(req.body);
        let { name, email, password, DOB, gender } = req.body;
        let data = new User({ name, email, password, DOB, gender });
        let response = await data.save();
        let myTokens = await data.getAuthToken();
        res.status(200).json({ message: "ok", userData: response, token: myTokens });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}


module.exports = {
    register
}