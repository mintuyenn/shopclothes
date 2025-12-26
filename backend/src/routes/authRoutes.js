import express from "express";
import { forgotPassword, resetPassword } from "../controllers/otpController.js";
import {
  register,
  login,
  checkEmailExists,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";
import { protect, onlyCustomer } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";
import passport from "passport";
import jwt from "jsonwebtoken"; // <--- THÊM DÒNG NÀY

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/check-email", checkEmailExists);
router.post("/forgot-password", forgotPassword); // gửi OTP hoặc token
router.post("/reset-password", resetPassword); // reset mật khẩu mới
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Route Google gọi lại (Callback)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-fail",
  }),
  (req, res) => {
    // Đăng nhập thành công, req.user chứa thông tin user
    const user = req.user;

    // Tạo JWT Token để trả về cho Client
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Chuyển hướng về Frontend kèm theo Token
    // Ví dụ Frontend chạy ở localhost:5173
    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
  }
);

export default router;
