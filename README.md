# 線上學習網站 (後端)  
1. 本專案為前、後端分離，此為後端部分
2. 後端框架為Express.js
3. 使用Passport.js完成會員登入
4. 使用MongoDB儲存會員資料
5. 會員資料(auth.js)相關 RESTful API  
   * 會員註冊 POST "/register"  
   * 會員登入 GET "/login"
6. 課程(course_route.js)相關 RESTful API  
   * 會員身份為 教師:
      * 新建課程 POST "/api/post"
      * 編輯課程 PATCH "/updatedata/:_id"
      * 刪除課程 DELETE "/deleteCourse/:_id"  
   * 會員身份為 學生:
      * 註冊課程 POST "/enroll/:_id"
      * 取消註冊課程 DELETE "/deleteEnroll/:_id"

   
