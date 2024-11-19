const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

// 確認
router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});

// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    //query object(thenable object)
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師id來尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let courseFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

// 用學生id尋找註冊過的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let courseFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

// 用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 驗證資料符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 確認身分是否為講師
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發佈新課程。若你已經是講師，請透過講師帳號登入。");
  }
  // 建立新課程
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    // let savedCourse = await newCourse.save();
    await newCourse.save();
    return res.send({
      msg: "新課程已經保存",
      //savedCourse,
    });
  } catch (e) {
    return res.status(500).send("無法創建課程。。。");
  }
});

// 讓學生透過id註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id);
    await course.save();
    return res.send("註冊完成");
  } catch (e) {
    return res.send(e);
  }
});

// 更改課程
router.patch("/updatedata/:_id", async (req, res) => {
  // 驗證資料符合規範
  //console.log(req.user._id);
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新課程內容。");
    }

    // 使用者必須是此課程講師，才能編輯課程
    if (courseFound.instructor.equals(req.user._id)) {
      let updateCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        msg: "課程更新成功。",
        updateCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete("/deleteCourse/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法刪除課程。");
    }
    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除。");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 取消註冊課程
router.delete("/deleteEnroll/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法取消註冊該課程。");
    }
    // 使用者必須是學生
    if (req.user.isStudent()) {
      //學生必須有註冊該課程
      if (courseFound.students.includes(req.user._id)) {
        courseFound.students.pull(req.user._id);
        await courseFound.save();
        return res.send("您成功取消註冊該課程。");
      } else {
        return res.status(400).send("您沒有註冊該課程。");
      }
    } else {
      return res.status(403).send("只有學生才能取消註冊課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
