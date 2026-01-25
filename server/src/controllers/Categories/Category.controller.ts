import CategoryRepository from "../../repositories/Categories/Category.repository";
import logger from "../../configs/loggerConfig";
import type { ICategoryModel } from "../../models/IModels";

class CategoryController {
    private _categoryRepository: CategoryRepository;
    constructor() {
        this._categoryRepository = new CategoryRepository();
    }

    public async getCategory(id: string): Promise<ICategoryModel | null> {
        try {
            logger.info({ categoryId: id }, "Fetching category by id");
            const category = await this._categoryRepository.findCategoryById(id);
            if (!category) {
                logger.warn({ categoryId: id }, "Category not found");
            }
            return category;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching category"
            );
            throw error;
        }
    }

    public async getCategoriesByUser(userId: string): Promise<ICategoryModel[]> {
        try {
            logger.info({ userId }, "Fetching categories by user");
            const categories = await this._categoryRepository.findCategoriesByUserId(userId);
            return categories;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching categories"
            );
            throw error;
        }
    }

    public async getCategoryByUserAndName(
        userId: string,
        name: string
    ): Promise<ICategoryModel | null> {
        try {
            logger.info({ userId, name }, "Fetching category by user and name");
            const category = await this._categoryRepository.findCategoryByUserAndName(
                userId,
                name
            );
            return category;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching category"
            );
            throw error;
        }
    }

    public async createCategory(
        categoryData: Partial<ICategoryModel>
    ): Promise<ICategoryModel> {
        try {
            logger.info({ userId: categoryData.userId }, "Creating new category");
            const category = await this._categoryRepository.createCategory(categoryData);
            logger.info(
                { categoryId: (category as any)._id },
                "Category created successfully"
            );
            return category;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error creating category"
            );
            throw error;
        }
    }

    public async updateCategory(
        id: string,
        categoryData: Partial<ICategoryModel>
    ): Promise<ICategoryModel | null> {
        try {
            logger.info({ categoryId: id }, "Updating category");
            const category = await this._categoryRepository.updateCategory(id, categoryData);
            if (!category) {
                logger.warn({ categoryId: id }, "Category not found for update");
            } else {
                logger.info({ categoryId: id }, "Category updated successfully");
            }
            return category;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error updating category"
            );
            throw error;
        }
    }

    public async deleteCategory(id: string): Promise<boolean> {
        try {
            logger.info({ categoryId: id }, "Deleting category");
            const result = await this._categoryRepository.deleteCategory(id);
            if (result) {
                logger.info({ categoryId: id }, "Category deleted successfully");
            } else {
                logger.warn({ categoryId: id }, "Category not found for deletion");
            }
            return result;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error deleting category"
            );
            throw error;
        }
    }
}

export default CategoryController;
