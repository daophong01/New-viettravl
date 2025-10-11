import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class WatchLater extends Model {
  declare id: number;
  declare userId: number;
  declare tourId: number;
}

WatchLater.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, modelName: "watch_later", indexes: [{ unique: true, fields: ["userId", "tourId"] }] }
);