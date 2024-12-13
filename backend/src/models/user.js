const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true,
            unique: true
        },

        firstname : {
            type: String,
            required: true
        },

        lastname : {
            type: String,
            required: true
        },

        avatar : {
            type : String,
        },

        password : {
            type: String
        },
    },
    {
        timestamps: true
    }
)

/* Needed for comparision of passwords */
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
  
const User = mongoose.model('User', userSchema);
  
module.exports = User;