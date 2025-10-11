import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin";
  declare status: "active" | "blocked";
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("user", "admin"), allowNull: false, defaultValue: "user" },
    status: { type: DataTypes.ENUM("active", "blocked"), allowNull: false, defaultValue: "active" },
  },
  { sequelize, modelName: "user" }
);