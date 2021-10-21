console.log("Client code running.");
const axios = require("axios");

const URI = "http://localhost:3000";

// 비효율적인 방법:
//       - blogLimit 20일 때 : 8초
//       - blogLimit 50일 때 : 18초

// populate 사용하는 방법
//       - blogLimit 20일 때 : 0.8초
//       - blogLimit 50일 때 : 0.8초
//       - blogLimit 200일 때 : 2초

// nesting 사용하는 방법
//       - blogLimit 20일 때 : 0.1~2초
//       - blogLimit 50일 때 : 0.2~3초
//       - blogLimit 200일 때 : 0.3초

const test = async () => {
  console.time("loading time: ");
  // let {
  //   data: { blogs }, // 구조분해 할당
  // } = await axios.get(`${URI}/blog`);
  // console.log(blogs[0]);
  // console.dir(blogs[0], { depth: 10 });
  // blogs = await Promise.all(
  //   blogs.map(async (blog) => {
  //     // async 로 인해서 return 값이 Promise 이므로 Promise 배열
  //     const [res1, res2] = await Promise.all([
  //       axios.get(`${URI}/user/${blog.user}`),
  //       axios.get(`${URI}/blog/${blog._id}/comment`),
  //     ]);
  //     blog.user = res1.data.user;
  //     blog.comments = await Promise.all(
  //       res2.data.comments.map(async (comment) => {
  //         const {
  //           data: { user },
  //         } = await axios.get(`${URI}/user/${comment.user}`);
  //         comment.user = user;
  //         return comment;
  //       })
  //     );

  //     return blog;
  //   })
  // );

  // console.dir(blogs[0], { depth: 10 }); // comments에서 user: [Object]로 나오는데 console.dir & depth 설정하면 다 나오게 할 수 있음
  console.timeEnd("loading time: ");
};

// test();

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
