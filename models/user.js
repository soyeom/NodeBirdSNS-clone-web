const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            // SNS 로그인 하는 경우 비밀번호 null일수도
            password: {
                type: Sequelize.STRING(100), //암호화하면 문자열 길어짐
                allowNull: true,
            },
            provider: { //로그인 제공자
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local', //local은 홈페이지 자체에서 로그인
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { //사람 대 사람도 다대다 관계
            foreignKey: 'followingId',
            as: 'Followers', //컬럼에 대한 별명
            through: 'Follow', //중간 테이블명
        });
        db.User.belongsToMany(db.User, { //팔로잉, 팔로워
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
};