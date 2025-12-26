import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`, // Đường dẫn Google gọi lại sau khi login xong
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const photo = profile.photos[0]?.value;

        // 1. Tìm xem user đã tồn tại chưa
        let user = await User.findOne({ email });

        if (user) {
          // Trường hợp: User đã đăng ký bằng email/pass trước đó (như user 'minhtuyen')
          // Ta cập nhật thêm googleId để lần sau họ login bằng Google cũng được
          if (!user.googleId) {
            user.googleId = googleId;
            if (!user.avatar) user.avatar = photo;
            await user.save();
          }
          return done(null, user);
        }

        // 2. Nếu chưa có, tạo user mới
        // Lưu ý: Username tạo tạm thời hoặc để trống nếu Schema cho phép
        const newUser = new User({
          fullName: profile.displayName,
          email: email,
          googleId: googleId,
          avatar: photo,
          // phone, password, address sẽ để trống
          // Tạo username ngẫu nhiên để tránh lỗi duplicate nếu cần
          username:
            email.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize & Deserialize User (để lưu vào session nếu dùng session, hoặc bỏ qua nếu dùng JWT)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
