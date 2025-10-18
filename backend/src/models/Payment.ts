import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Payment extends Model {
  declare id: number;
  declare sessionId: string;
  declare amount: number;
  declare status: "succeeded" | "failed" | "pending";
  declare userId: number | null;
  declare tourId: number | null;
  declare customerEmail: string | null;
  declare paymentIntentId: string | null;
  declare paymentMethod: "stripe" | "vnpay" | "momo" | "paypal" | null;
  declare currency: string | null;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    sessionId: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM("succeeded", "failed", "pending"), allowNull: false, defaultValue: "pending" },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    customerEmail: { type: DataTypes.STRING, allowNull: true },
    paymentIntentId: { type: DataTypes.STRING, allowNull: true },
    paymentMethod: { type: DataTypes.ENUM("stripe", "vnpay", "momo", "paypal"), allowNull: true },
    currency: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "payment" }
);