import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Tour extends Model {
  declare id: number;
  declare title: string;
  declare location: string;
  declare price: number;
  declare duration: string;
  declare image: string;
  declare imagePublicId: string | null;
  declare description: string;
  declare rating: number;
  declare category: "domestic" | "international";
  declare startDate: Date | null;
  declare seatsLeft: number;
  declare active: boolean;
}

Tour.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    duration: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    imagePublicId: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    category: { type: DataTypes.ENUM("domestic", "international"), allowNull: false, defaultValue: "domestic" },
    startDate: { type: DataTypes.DATE, allowNull: true },
    seatsLeft: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "tour" }
);