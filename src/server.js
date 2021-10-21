const express = require("express");
const mongoose = require("mongoose");
const { userRouter, blogRouter } = require("./routes");
// const { commentRouter } = require("./routes");
const { generateFakeData } = require("../faker2");

const app = express();

const server = async () => {
  try {
    const { MONGO_URI, PORT } = process.env;
    if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");
    if (!PORT) throw new Error("PORT is required!!!");

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // mongoose.set("debug", true);
    console.log("MongoDB connected");

    // HTTP Request body의 JSON형태의 데이터가 넘어왔을떄 String 타입으로 넘어오는데,
    // 이 데이터를 JS 객체처럼 사용하기 위해서는 미들웨어인 express.json()를 통과해서 넘어온다
    app.use(express.json());

    /*
      /user    : 독립적 호출 가능
      /blog    : 독립적 호출 가능
      /blog/:blogId/comment     : 독립적 호출 없음 (하위 개념)
    */
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    // app.use("/blog/:blogId/comment", commentRouter);

    // 미들웨어 정리
    // CORS : 설정하지 않은 이상한 외부 도메인에서 요청하는 것을 막는것
    // JSON.parse: JSON(String 타입)으로 넘어온 Request Body를 파싱해서 JS 객체 형식으로 변환
    // authenticate: 로그인 등의 인증처리
    // logging: API 의 호출, 에러등을 기록
    // router: 라우터 처리

    app.listen(PORT, async () => {
      console.log(`server listening on port ${PORT}`);
      // await generateFakeData(10, 2, 10);
    });
  } catch (err) {
    console.log({ err });
  }
};

server();
