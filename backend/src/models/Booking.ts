import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Booking extends Model {
  declare id: number;
  declare userId: number;
  declare tourId: number;
  declare status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
  declare paymentStatus: "pending" | "paid" | "failed";
  declare bookedAt: Date;
  declare departureDate: Date | null;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    bookedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    departureDate: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: "booking" }
);