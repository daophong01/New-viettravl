import { User } from "./User.js";
import { Tour } from "./Tour.js";
import { Booking } from "./Booking.js";
import { Review } from "./Review.js";
import { Payment } from "./Payment.js";
import { SupportMessage } from "./SupportMessage.js";
import { LoginEvent } from "./LoginEvent.js";
import { Favorite } from "./Favorite.js";
import { WatchLater } from "./WatchLater.js";
import { Notification } from "./Notification.js";

// Associations
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Tour.hasMany(Booking, { foreignKey: "tourId" });
Booking.belongsTo(Tour, { foreignKey: "tourId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

Tour.hasMany(Review, { foreignKey: "tourId" });
Review.belongsTo(Tour, { foreignKey: "tourId" });

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

Tour.hasMany(Payment, { foreignKey: "tourId" });
Payment.belongsTo(Tour, { foreignKey: "tourId" });

User.hasMany(SupportMessage, { foreignKey: "userId" });
SupportMessage.belongsTo(User, { foreignKey: "userId" });

User.hasMany(LoginEvent, { foreignKey: "userId" });
LoginEvent.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

Tour.hasMany(Favorite, { foreignKey: "tourId" });
Favorite.belongsTo(Tour, { foreignKey: "tourId" });

User.hasMany(WatchLater, { foreignKey: "userId" });
WatchLater.belongsTo(User, { foreignKey: "userId" });

Tour.hasMany(WatchLater, { foreignKey: "tourId" });
WatchLater.belongsTo(Tour, { foreignKey: "tourId" });

export { User, Tour, Booking, Review, Payment, SupportMessage, LoginEvent, Favorite, WatchLater, Notification };