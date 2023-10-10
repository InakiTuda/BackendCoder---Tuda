import passport from "passport";
import userModel from "../db/models/user.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { usersManager } from "../../DAL/DAOs/userManagerMongo.js";
import { compareData } from "../../utils.js";

// Estrategia Local
passport.use("local", new LocalStrategy (
    async function (username, password, done) {
        try {
            const user = await usersManager.findUser(username)
            if (!user) {
                return done (null, false)
            }
            const isPasswordValid = await compareData(password, user.password)
            if (!isPasswordValid) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            done (error)
        }
    }
));

// Estrategia Github
passport.use("github", new GithubStrategy ({
    clientID: 'Iv1.886529c8e91a6d9a',
    clientSecret: 'f8b3206f5c3d035758334b7e5b7df346e63d0384',
    callbackURL: 'http://localhost:8080/api/session/githubcallback',
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            //console.log(profile)
            const user = await userModel.findOne({email: profile.username});
            if (user) {
                return done(null, user)
            }
            //console.log(user)
            // Login
            if(user) {
                if(user.fromGithub) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            }
            // Register
            const newUser = {
                first_name: profile.displayName.split(" ") [0],
                last_name: profile.displayName.split(" ") [1],
                email: profile.username,
                password: " ",
                fromGithub: true,
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            done(error)
        }
    }
));

// User => ID
passport.serializeUser((user, done) => {
    //console.log('serializeUser')
    //console.log(user)
    //console.log('serializeUser')
    done(null, user)
});

// ID => User
passport.deserializeUser(async (id, done) => {
    try {
        //console.log('deserializeUser')
        //console.log(id)
        //console.log('deserializeUser')
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
});