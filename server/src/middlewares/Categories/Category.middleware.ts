import { Request, Response } from "express";
import { ICategoryModel } from "../../models/IModels";
import CategoryController from "../../controllers/Categories/Category.controller";
import logger from "../../configs/loggerConfig";
import { validateCreateCategoryData, validateUpdateCategoryData } from "./validations";

class CategoryMiddleware {
    private categoryController = new CategoryController();

    public async createCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Create category request received");
            const { name, description, userId } = req.body as Partial<ICategoryModel>;

            if (!validateCreateCategoryData(req.body)) {
                logger.warn({ name, userId }, "Invalid category data");
                res.status(400).json({ message: "Invalid category data" });
                return;
            }

            const existingCategory = await this.categoryController.getCategoryByUserAndName(
                userId!,
                name!
            );
            if (existingCategory) {
                logger.warn(
                    { name, userId },
                    "Category already exists for this user"
                );
                res.status(409).json({ message: "Category already exists" });
                return;
            }

            const newCategory = await this.categoryController.createCategory({
                name: name?.trim(),
                description: description?.trim(),
                userId,
            });

            logger.info({ categoryId: (newCategory as any)._id }, "Category created successfully");
            res.status(201).json({
                message: "Category created successfully",
                category: newCategory,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in create category middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get category request received");
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                logger.warn("Category ID not provided");
                res.status(400).json({ message: "Category ID is required" });
                return;
            }

            const category = await this.categoryController.getCategory(id as string);
            if (!category) {
                logger.warn({ categoryId: id }, "Category not found");
                res.status(404).json({ message: "Category not found" });
                return;
            }

            logger.info({ categoryId: id }, "Category fetched successfully");
            res.status(200).json({
                message: "Category fetched successfully",
                category,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get category middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getCategoriesByUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get categories by user request received");
            const { userId } = req.params;

            if (!userId || Array.isArray(userId)) {
                logger.warn("User ID not provided");
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            const categories = await this.categoryController.getCategoriesByUser(userId as string);

            logger.info({ userId }, "Categories fetched successfully");
            res.status(200).json({
                message: "Categories fetched successfully",
                categories,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get categories middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async updateCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Update category request received");
            const { id } = req.params;
            const { name, description } = req.body as Partial<ICategoryModel>;

            if (!id || Array.isArray(id)) {
                logger.warn("Category ID not provided");
                res.status(400).json({ message: "Category ID is required" });
                return;
            }

            if (!validateUpdateCategoryData(req.body)) {
                logger.warn({ categoryId: id }, "Invalid update data");
                res.status(400).json({ message: "Invalid category data" });
                return;
            }

            const existingCategory = await this.categoryController.getCategory(id as string);
            if (!existingCategory) {
                logger.warn({ categoryId: id }, "Category not found");
                res.status(404).json({ message: "Category not found" });
                return;
            }

            const updatedData: Partial<ICategoryModel> = {};
            if (name) updatedData.name = name.trim();
            if (description) updatedData.description = description.trim();

            const updatedCategory = await this.categoryController.updateCategory(id as string, updatedData);

            logger.info({ categoryId: id }, "Category updated successfully");
            res.status(200).json({
                message: "Category updated successfully",
                category: updatedCategory,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in update category middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async deleteCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Delete category request received");
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                logger.warn("Category ID not provided");
                res.status(400).json({ message: "Category ID is required" });
                return;
            }

            const existingCategory = await this.categoryController.getCategory(id as string);
            if (!existingCategory) {
                logger.warn({ categoryId: id }, "Category not found");
                res.status(404).json({ message: "Category not found" });
                return;
            }

            await this.categoryController.deleteCategory(id as string);

            logger.info({ categoryId: id }, "Category deleted successfully");
            res.status(200).json({
                message: "Category deleted successfully",
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in delete category middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
}

export default CategoryMiddleware;
