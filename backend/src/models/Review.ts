import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Review extends Model {
  declare id: number;
  declare userId: number;
  declare tourId: number;
  declare rating: number;
  declare comment: string;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tourId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "review" }
);