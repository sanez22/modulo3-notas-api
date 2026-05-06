import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const CategoryModel = sequelize.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default CategoryModel;