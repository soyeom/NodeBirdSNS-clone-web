const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

//회원가입 라우터
router.post('/join', async(req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', () => {
    //미들웨어 내의 미들웨어에는 (req, res, next)를 붙임
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            //세션 쿠키를 브라우저로 보낸다.
            return res.redirect('/');
        });
    }) (req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;