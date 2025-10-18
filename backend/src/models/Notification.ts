import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Notification extends Model {
  declare id: number;
  declare type: "booking_created" | "payment_succeeded";
  declare payload: string; // JSON string
  declare read: boolean;
  declare createdAt: Date;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM("booking_created", "payment_succeeded"), allowNull: false },
    payload: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: "notification" }
);