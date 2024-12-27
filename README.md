# 線上學習網站 (後端)  
1. 本專案為前、後端分離，此為後端部分
2. 後端框架為Express.js、Node.js
3. 使用Passport.js完成會員登入
4. 使用MongoDB儲存會員資料
5. 會員資料(auth.js)相關 RESTful API  
   1. 會員註冊 POST "/register"
   2. 會員登入 GET "/login"
6. 課程(course_route.js)相關 RESTful API  
   1. 會員身份為 教師:
      * 新增課程 POST "/api/post"
      * 編輯課程內容 PATCH "/updatedata/:_id"
      * 刪除課程 DELETE "/deleteCourse/:_id"  
   2. 會員身份為 學生:
      * 註冊課程 POST "/enroll/:_id"
      * 取消註冊課程 DELETE "/deleteEnroll/:_id"
7.  本專案使用[Render](https://render.com/)網站進行部署，前往[線上學習網站](https://mern-project-client-49t7.onrender.com)  
## 因Render網站的決策，本專案的Server不使用時會進入睡眠，所以在進行註冊/登入時會需要等待30秒以上。

   
