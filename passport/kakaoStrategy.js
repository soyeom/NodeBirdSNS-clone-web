const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try { //카카오로 가입한 사람 있는지 찾아봄
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if(exUser) {
                done(null, exUser); //성공했으면 redirect해서 메인 페이지로 돌아감
            }
            else {
                const newUser = await User.create({
                    email: profile.__json && profile.__json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        }
        catch (error) {
            console.log(error);
            done(error);
        }
    }
    ));
}