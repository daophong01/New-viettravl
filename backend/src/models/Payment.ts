import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Payment extends Model {
  declare id: number;
  declare sessionId: string;
  declare amount: number;
  declare status: "succeeded" | "failed" | "pending";
  declare userId: number | null;
  declare tourId: number | null;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    sessionId: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM("succeeded", "failed", "pending"), allowNull: false, defaultValue: "pending" },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  },
  { sequelize, modelName: "payment" }
);