import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class SupportMessage extends Model {
  declare id: number;
  declare name: string | null;
  declare email: string | null;
  declare userId: number | null;
  declare message: string;
  declare status: "new" | "resolved";
}

SupportMessage.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("new", "resolved"), allowNull: false, defaultValue: "new" },
  },
  { sequelize, modelName: "support_message" }
);