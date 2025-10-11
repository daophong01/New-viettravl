import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Booking extends Model {
  declare id: number;
  declare userId: number;
  declare tourId: number;
  declare status: "booked" | "cancelled";
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM("booked", "cancelled"), allowNull: false, defaultValue: "booked" },
  },
  { sequelize, modelName: "booking" }
);