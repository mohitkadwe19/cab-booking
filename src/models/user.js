const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const Database = require('../db/conn')
const userSchema = new Schema({

    name: { type: String },
    email: { type: String },
    password: { type: String },
    DOB: { type: String },
    gender: { type: String },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ]
}, {
    timestamps: true,
}
);

userSchema.pre('save', function (next) {
    var salt = bcrypt.genSaltSync(10);
    if (this.password && this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();

})

userSchema.methods.getAuthToken = async function (Data) {
    let params = {
        id: this._id,
        email: this.email,
        DOB: this.DOB,
        gender: this.gender,
    }
    var tokenValue = await jwt.sign(params, process.env.secretKey, { expiresIn: '300000s' });
    this.tokens = await this.tokens.concat({ token: tokenValue });
    await this.save();
    return tokenValue;
}

var User = Database.model('User', userSchema);

module.exports = User;
