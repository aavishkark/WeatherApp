const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { UserModel } = require('../Model/user.model')
require("dotenv").config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await UserModel.findOne({ googleId: profile.id })
        if (user) {
            return done(null, user)
        }
        else {
            const existingUser = await UserModel.findOne({ email: profile.emails[0].value })
            if (existingUser) {
                existingUser.googleId = profile.id
                existingUser.authProvider = "google"
                existingUser.profilePic = profile.photos[0].value
                await existingUser.save()
                return done(null, existingUser)
            }
            else {
                const newUser = new UserModel({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    authProvider: "google",
                    profilePic: profile.photos[0].value,
                    favorites: []
                })
                await newUser.save()
                return done(null, newUser)
            }
        }
    }
    catch (err) {
        return done(err, null)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    }
    catch (err) {
        done(err, null)
    }
})

module.exports = { passport }
