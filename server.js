const express = require('express');
const app = express();

const users = [];

// HTTP Request body의 JSON형태의 데이터가 넘어왔을떄 String 타입으로 넘어오는데,
// 이 데이터를 JS 객체처럼 사용하기 위해서는 미들웨어인 express.json()를 통과해서 넘어온다
app.use(express.json());

// 미들웨어 정리
// CORS : 설정하지 않은 이상한 외부 도메인에서 요청하는 것을 막는것
// JSON.parse: JSON(String 타입)으로 넘어온 Request Body를 파싱해서 JS 객체 형식으로 변환
// authenticate: 로그인 등의 인증처리
// logging: API 의 호출, 에러등을 기록
// router: 라우터 처리

app.get('/user', function(req, res) {
    return res.send({ users: users });
});

app.post('/user', function(req, res) {
    users.push({ name: req.body.name, age: req.body.age });
    return res.send({ success: true });
});

app.listen(3000, function() {
    console.log('server listening on port 3000');
})