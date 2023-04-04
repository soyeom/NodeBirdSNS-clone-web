const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); //가볍게 세션에 user의 id 저장
    });//done 하는 순간 auth.js의 req.login으로 감

    //나중에 세션의 id로 User를 복구하기 때문에 메모리 효율적
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
            .then(user => done(null, user)) //req.user로 로그인 한 사용자 정보 획득 가능
            .catch(err => done(err));
    });

    local();
    kakao();
};