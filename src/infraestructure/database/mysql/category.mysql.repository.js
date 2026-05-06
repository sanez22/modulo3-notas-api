import CategoryModel from "./category.model.js";

export default class CategoryMySQLRepository {
    async save(categoryEntity) {
        const category = await CategoryModel.create({
            name: categoryEntity.name,
            description: categoryEntity.description,
            userId: categoryEntity.userId
        });

        return category.toJSON();
    }

    async findByUserId(userId) {
        const categories = await CategoryModel.findAll({
            where: { userId }
        });

        return categories.map(category => category.toJSON());
    }

    async findById(id) {
        const category = await CategoryModel.findByPk(id);
        return category ? category.toJSON() : null;
    }
}