const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const db = require('../models');
const { internalServer } = require('../middlewares/handleError');
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/auth/google/callback',
        },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                const { id, displayName, emails, provider } = await profile;
                const user = await db.Users.findOrCreate({
                    where: { id_google: id, email: emails[0].value },
                    defaults: {
                        fullName: displayName,
                        email: emails[0].value,
                        login_type: provider,
                        id_google: id,
                    },
                });
                return cb(null, user);
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    ),
);
