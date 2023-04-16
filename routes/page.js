const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerList = [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: "내 정보 - NodeBird" });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: "회원 가입 - NodeBird" });
});

router.get('/', (req, res, next) => {
    const twits = []; //게시글을 넣어줄 배열
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

module.exports = router;