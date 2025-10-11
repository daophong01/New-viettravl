import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin";
  declare status: "active" | "blocked";
  declare avatar: string | null;
  declare avatarPublicId: string | null;
  declare pendingEmail: string | null;
  declare emailChangeCode: string | null;
  declare emailChangeExpires: Date | null;
  declare resetCode: string | null;
  declare resetExpires: Date | null;
  declare logoutAllAt: Date | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("user", "admin"), allowNull: false, defaultValue: "user" },
    status: { type: DataTypes.ENUM("active", "blocked"), allowNull: false, defaultValue: "active" },
    avatar: { type: DataTypes.STRING, allowNull: true },
    avatarPublicId: { type: DataTypes.STRING, allowNull: true },
    pendingEmail: { type: DataTypes.STRING, allowNull: true },
    emailChangeCode: { type: DataTypes.STRING, allowNull: true },
    emailChangeExpires: { type: DataTypes.DATE, allowNull: true },
    resetCode: { type: DataTypes.STRING, allowNull: true },
    resetExpires: { type: DataTypes.DATE, allowNull: true },
    logoutAllAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: "user" }
);