import CategoryService from "../../src/aplication/use-cases/category.service.js";

describe("CategoryService", () => {
    Test("should create a category successfully", async () => {
        const mockCategoryRepository = {
            save: jest.fn().mockResolvedValue({
                id: 1,
                name: "Ideas",
                description: "Categoría para ideas",
                userId: "user123"
            })
        };

        const categoryService = new CategoryService(mockCategoryRepository);

        const result = await categoryService.createCategory({
            name: "Ideas",
            description: "Categoría para ideas",
            userId: "user123"
        });

        expect(result).toEqual({
            id: 1,
            name: "Ideas",
            description: "Categoría para ideas",
            userId: "user123"
        });

        expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
    });
});