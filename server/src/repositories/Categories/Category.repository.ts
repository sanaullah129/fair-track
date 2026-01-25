import { ICategoryModel } from "../../models/IModels";
import CategoryModel from "../../models/Category.model";

class CategoryRepository {
    constructor() {}

    public async findCategoryById(id: string): Promise<ICategoryModel | null> {
        const category = await CategoryModel.findById(id);
        return category;
    }

    public async findCategoryByUserAndName(
        userId: string,
        name: string
    ): Promise<ICategoryModel | null> {
        const category = await CategoryModel.findOne({
            userId,
            name: { $regex: name, $options: "i" },
        });
        return category;
    }

    public async findCategoriesByUserId(userId: string): Promise<ICategoryModel[]> {
        const categories = await CategoryModel.find({ userId });
        return categories;
    }

    public async createCategory(
        categoryData: Partial<ICategoryModel>
    ): Promise<ICategoryModel> {
        const newCategory = new CategoryModel(categoryData);
        const savedCategory = await newCategory.save();
        return savedCategory.toObject();
    }

    public async updateCategory(
        id: string,
        categoryData: Partial<ICategoryModel>
    ): Promise<ICategoryModel | null> {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            categoryData,
            { new: true }
        );
        return updatedCategory;
    }

    public async deleteCategory(id: string): Promise<boolean> {
        const result = await CategoryModel.findByIdAndDelete(id);
        return !!result;
    }
}

export default CategoryRepository;
