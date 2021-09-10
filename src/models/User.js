const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        },
    },
    age: Number, // type만 지정할 수 있음
    email: String
}, {
    timestamps: true // 데이터를 생설할 때 createdAt, 업데이트할 때마다 updateedAt 넣어줌
});

const User = model('user', UserSchema);
module.exports = { User };