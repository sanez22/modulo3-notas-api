export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res) => {
        const data = req.body;
        data.userId = req.user.id;

        try {
            const category = await this.categoryService.createCategory(data);

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    getCategoriesByUserId = async (req, res) => {
        const userId = req.user.id;

        try {
            const categories = await this.categoryService.getCategoriesByUserId(userId);

            res.status(200).json({
                success: true,
                message: "Categories retrieved successfully",
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}