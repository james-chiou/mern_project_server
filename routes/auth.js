const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

// 確認
router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});
// 測試
router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});

// 註冊
router.post("/register", async (req, res) => {
  //console.log("註冊使用者。");
  //console.log(registerValidation(req.body));
  //確認資料是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了。。。");

  //製作新用戶
  let { username, email, password, role } = req.body;
  let newUser = new User({ username, email, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存。",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

// 登入
router.post("/login", async (req, res) => {
  //確認填寫的資料是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認使用者是否註冊過
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    // 401 unAuth
    return res.status(401).send("無法找到使用者。請確認信箱是否正確。");
  }

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
