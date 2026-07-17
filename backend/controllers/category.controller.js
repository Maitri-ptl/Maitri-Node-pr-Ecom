import Category from "../models/category.model.js";

//create category controller
// api/category/create
export const createCategory = async(req,res)=>{
    try {
        const {name} = req.body;
        const category = await Category.create({name});
        return res.status(201).json({message : "Category created successfully", category});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

//get all categories controller
// api/category/get-all
export const getCategories = async(req,res)=>{
    try {
        const categories = await Category.find();
        return res.status(200).json({message : "Categories found", categories});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

export const getCategoryById = async(req,res)=>{
    try {
        const {id} = req.params; 
        const category = await Category.findById(id);
        if(!category) return res.status(404).json({message : "Category not Found"})
        return res.status(200).json({category})

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

//update category controller
// api/category/update/:id
export const updateCategory = async(req,res)=>{
    try {
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id, req.body, {new: true});
        if(!category){
            return res.status(404).json({message : "Category not found"});
        }
        return res.status(200).json({message : "Category updated successfully", category});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }   
}

//delete category controller
// api/category/delete/:id
export const deleteCategory = async(req,res)=>{
    try {
        const {id} = req.params;
        const category = await Category.findByIdAndDelete(id);
        if(!category){
            return res.status(404).json({message : "Category not found"});
        }   
        return res.status(200).json({message : "Category deleted successfully", category});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}
