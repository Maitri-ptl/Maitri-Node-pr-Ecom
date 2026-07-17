import Product from "../models/product.model.js";

export const createProducts = async(req,res)=>{
    try {
        const {name,price,description,category,image} = req.body;

        if(!name || !price || !description || !category){
            return res.status(400).json({message : "Enter all Data first"})
        }

        const product = await Product.create({name,price,description,category,image})

        return res.status(201).json({message : "Product created successfully", product})

    } catch (error) {
        return res.status(500).json({message : "Error creating product", error})
    }
}

export const getProducts = async(req,res)=>{
    try {
        const products = await Product.find().populate("category");
        return res.status(200).json({message : "Products found", products});
    } catch (error) {
        return res.status(500).json({message : "Error fetching products", error});
    }
}

export const getProductById = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message : "Product not found"});
        }
        return res.status(200).json({message : "Product found", product});
    } catch (error) {
        return res.status(500).json({message : "Error fetching product by ID", error});
    }
}

export const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
        if(!product){
            return res.status(404).json({message : "Product not found"});
        }
        return res.status(200).json({message : "Product updated successfully", product});
    } catch (error) {
        return res.status(500).json({message : "Error updating product", error});
    }
}

export const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message : "Product not found"});
        }
        return res.status(200).json({message : "Product deleted successfully", product});
    } catch (error) {
        return res.status(500).json({message : "Error deleting product", error});
    }
}
