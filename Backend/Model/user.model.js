const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    username: String,
    favorites: Array,
    googleId: String,
    authProvider: String,
    profilePic: String
}, {
    versionKey: null
})
const UserModel = mongoose.model('weather_app_user', userSchema)
module.exports = {
    UserModel
}
