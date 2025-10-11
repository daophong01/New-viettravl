import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Favorite extends Model {
  declare id: number;
  declare userId: number;
  declare tourId: number;
}

Favorite.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, modelName: "favorite", indexes: [{ unique: true, fields: ["userId", "tourId"] }] }
);