const { Router } = require("express");
const mongoose = require("mongoose");

const { User } = require("../models/User");

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    console.log({ err });
    return res.status(500).send({ err: err.message });
  }
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });

    const user = await User.findOne({ _id: userId });

    return res.send({ user });
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ err: err.message });
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const { username, name } = req.body;
    if (!username) return res.status(400).send({ err: "username is required" });
    if (!name || !name.first || !name.last)
      return res
        .status(400)
        .send({ err: "Both first and last names are required" });
    const user = new User(req.body);
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ err: err.message });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ err: "invalid userId" });
    }

    const { age, name } = req.body;
    if (!age && !name)
      return res.status(400).send({ err: "age or name is required" });
    if (age && typeof age !== "number")
      return res.status(400).send({ err: "age must be a number" });
    if (
      name &&
      (typeof name.first !== "string" || typeof name.last !== "string")
    )
      return res
        .status(400)
        .send({ err: "first and last name are not strings" });
    // 방법 1 (findByIdAndUpdate) - 방법 2 보다 더 효율적임(방법 2는 DB에 두번 왔다갔다 하는데 방법 1은 그래도 1번만 왔다갔다함)
    // const updateBody = {};

    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;

    // // findOneAndUpdate같이 Update 명령어를 MongoDB에 넘겨주면 Mongoose를 거치는게 아니라 바로 MongoDB에 명령하기 때문에 스키마(필수값) 체크를 안한다
    // // save() 메서드를 사용하면 new User({}); 처럼 만들어진 인스턴스는 스키마를 확인한다 (findOne으로 가져온 데이터를 save로 업데이트하면 좀 느리긴 하지만 자원을 그렇게 많이 잡아먹지 않음(왜냐하면 find같은 경우 빈번히 일어나는 메서드이기 때문에))
    // const user = await User.findByIdAndUpdate(userId, updateBody, {
    //   new: true,
    // }); // age: age 이지만  key, value 같아서 age

    //방법 2(findOne 해서 가져온 인스턴스를 수정 후 save)
    const user = await User.findById(userId);
    console.log({ userBeforeEdit: user });
    if (age) user.age = age;
    if (name) user.name = name;
    console.log({ userAfterEdit: user });
    await user.save(); // mongoose가 userBeforeEdit과 userAfterEdit을 비교해서 _id가 같으면 save할때 바뀐 부분만 찾아서 updateOne으로 처리

    // new: true가 없어도 이미 위에서 수정을 해준 상태이기 때문에 바뀐 인스턴스가 return으로 날아감
    // new: true를 해주면 update후에 find로 다시 찾아서 return 해주는 거라 new: true 없는거보다 조금 비효율 적이긴 함
    return res.send({ user });
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ err: err.message });
  }
});

userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });

    const user = await User.findOneAndDelete({ _id: userId });

    return res.send({ user });
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  userRouter,
};
