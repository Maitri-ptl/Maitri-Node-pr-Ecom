import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/create", createCategory);
categoryRouter.get("/get-all", getCategories);
categoryRouter.get("/get/:id", getCategoryById);
categoryRouter.put("/update/:id", updateCategory);
categoryRouter.delete("/delete/:id", deleteCategory);

export default categoryRouter;