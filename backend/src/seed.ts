import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import { User } from "./models/User.js";
import { Tour } from "./models/Tour.js";
import { Booking } from "./models/Booking.js";
import { Review } from "./models/Review.js";

dotenv.config();

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Seed admin if missing
    const adminEmail = "admin@example.com";
    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
      });
      console.log("Seeded admin user");
    }

    // Seed a demo user
    const userEmail = "user@example.com";
    let demoUser = await User.findOne({ where: { email: userEmail } });
    if (!demoUser) {
      demoUser = await User.create({
        name: "Người dùng demo",
        email: userEmail,
        password: "user123",
        role: "user",
      });
      console.log("Seeded demo user");
    }

    // Seed tours if empty
    const count = await Tour.count();
    if (count === 0) {
      await Tour.bulkCreate([
        {
          title: "Hạ Long Bay Retreat",
          location: "Quảng Ninh, Việt Nam",
          price: 2999000,
          duration: "3 ngày 2 đêm",
          image: "https://res.cloudinary.com/demo/image/upload/halong.jpg",
          description:
            "Khám phá vịnh Hạ Long - di sản thiên nhiên thế giới với những hang động kỳ vĩ.",
          rating: 4.7,
        },
        {
          title: "Đà Lạt Romantic Escape",
          location: "Lâm Đồng, Việt Nam",
          price: 2599000,
          duration: "2 ngày 1 đêm",
          image: "https://res.cloudinary.com/demo/image/upload/dalat.jpg",
          description:
            "Trải nghiệm không khí trong lành của thành phố ngàn hoa, các điểm check-in nổi tiếng.",
          rating: 4.5,
        },
        {
          title: "Phú Quốc Island Discovery",
          location: "Kiên Giang, Việt Nam",
          price: 3999000,
          duration: "4 ngày 3 đêm",
          image: "https://res.cloudinary.com/demo/image/upload/phuquoc.jpg",
          description:
            "Thiên đường biển đảo với bãi cát trắng mịn, làn nước trong xanh.",
          rating: 4.8,
        },
        {
          title: "Nha Trang Beach Holiday",
          location: "Khánh Hòa, Việt Nam",
          price: 3499000,
          duration: "3 ngày 2 đêm",
          image: "https://res.cloudinary.com/demo/image/upload/nhatrang.jpg",
          description: "Nghỉ dưỡng tại bãi biển tuyệt đẹp và tham gia các hoạt động lặn biển.",
          rating: 4.6,
        },
        {
          title: "Sapa Mountain Trekking",
          location: "Lào Cai, Việt Nam",
          price: 3199000,
          duration: "3 ngày 2 đêm",
          image: "https://res.cloudinary.com/demo/image/upload/sapa.jpg",
          description: "Leo núi, khám phá ruộng bậc thang và văn hóa dân tộc vùng cao.",
          rating: 4.7,
        },
      ]);
      console.log("Seeded tours");
    }

    // Seed bookings and reviews demo
    const tours = await Tour.findAll({ limit: 3 });
    if (tours.length > 0) {
      const existingBookings = await Booking.count();
      if (existingBookings === 0) {
        await Booking.bulkCreate([
          { userId: demoUser!.id, tourId: tours[0].id, status: "booked" },
          { userId: demoUser!.id, tourId: tours[1].id, status: "booked" },
          { userId: admin!.id, tourId: tours[2].id, status: "booked" },
        ]);
        console.log("Seeded bookings");
      }
      const existingReviews = await Review.count();
      if (existingReviews === 0) {
        await Review.bulkCreate([
          { userId: demoUser!.id, tourId: tours[0].id, rating: 5, comment: "Hành trình tuyệt vời, dịch vụ chu đáo!" },
          { userId: demoUser!.id, tourId: tours[1].id, rating: 4, comment: "Khung cảnh đẹp, sẽ quay lại vào mùa hoa." },
          { userId: admin!.id, tourId: tours[2].id, rating: 5, comment: "Rất đáng trải nghiệm!" },
        ]);
        console.log("Seeded reviews");
      }
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (e) {
    console.error("Seeding error", e);
    process.exit(1);
  }
}

run();