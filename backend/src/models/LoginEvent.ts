import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class LoginEvent extends Model {
  declare id: number;
  declare userId: number;
  declare ip: string | null;
  declare userAgent: string | null;
}

LoginEvent.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ip: { type: DataTypes.STRING, allowNull: true },
    userAgent: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "login_event" }
);