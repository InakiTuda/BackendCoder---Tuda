import passport from "passport";
import userModel from "../src/dao/models/user.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import {usersManager} from "../src/dao/mongomanagers/userManagerMongo.js";
import { compareData } from "../src/utils.js";

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
    clientID: "Iv1.886529c8e91a6d9a",
    clientSecret: "f8b3206f5c3d035758334b7e5b7df346e63d0384",
    callbackURL: "http://localhost:8080/api/session/github"
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            const user = await usersManager.findUser(profile.username)
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
                first_name: profile.displayName.split("") [0],
                last_name: profile.displayName.split("") [1],
                username: profile.username,
                password: "",
                fromGithub: true
            }
            const result = await usersManager.create(newUser)
            return done(null, result)
        } catch (error) {
            done(error)
        }
    }
));

// User => ID
passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})

// ID => User
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
});