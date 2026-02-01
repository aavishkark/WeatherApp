const mongoose = require("mongoose")
const favoriteSchema = mongoose.Schema({
    userId: String,
    cityName: String,
    country: String,
    lat: Number,
    lon: Number
}, {
    versionKey: null
})
const FavoriteModel = mongoose.model('weather_app_favorites', favoriteSchema)
module.exports = {
    FavoriteModel
}
