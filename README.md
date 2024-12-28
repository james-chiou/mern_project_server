# 線上學習網站 (後端)  
1. 本專案為前、後端分離
2. 後端以Express.js為框架，[前端](https://github.com/james-chiou/mern_project_client)則以React.js為框架
## 目標
1. 使用React、Express、Node.js與MongoDB完成一個MERN專案
2. 模仿線上學習網站，老師可以開設課程，而學生能夠註冊想要學習的課程
## 使用套件
1. Express
2. mongoose
3. bcrypt
4. dotenv
5. passport
6. jsonwebtoken
7. joi
## 功能
1. 使用Passport.js完成會員登入的驗證
   * 設定好你的passportr金鑰將它保存在environment variable
   ```javascript
    opts.secretOrKey = process.env.PASSPORT_SECRET;
   ```
2. 使用MongoDB儲存會員資料  
   * 設定好你的connection string將它保存在environment variable  
```javascript
   mongoose.connect(process.env.MOMGODB_CONNECTION)
```
3. 會員資料(auth.js)相關 RESTful API  
   1. 會員註冊 POST "/register"
      ```javascript
      {
         username,
         email,
         password,
         role:{
            enum: ["student", "instructor"]
         },
      }
      ```
   2. 會員登入 GET "/login"
     ```javascript
      {
        email,
        password,
      }
      ```
4. 課程(course_route.js)相關 RESTful API  
   1. 會員身份為 教師:
      * 新增課程 POST "/"
        ```javascript
      {
         title,
         description,
         price,
         instructorr: req.user._id,
      }
      ```
      * 編輯課程內容 PATCH "/updatedata/{course_id}"
       ```javascript
      {
         title,
         description,
         price,
      }
      ```
      * 刪除課程 DELETE "/deleteCourse/{course_id}"  
   3. 會員身份為 學生:
      * 註冊課程 POST "/enroll/{course_id}"
      * 取消註冊課程 DELETE "/deleteEnroll/{course_id}"
5.  本專案使用[Render](https://render.com/)網站進行部署，前往[線上學習網站](https://mern-project-client-49t7.onrender.com)
## 注意事項
因Render網站的決策，本專案的Server不使用時會進入睡眠，所以在進行註冊/登入時會需要等待30秒以上。

   
