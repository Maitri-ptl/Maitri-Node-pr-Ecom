import { Router } from "express";
import { createProducts, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import { adminAuth, verifyToken } from "../middlewares/authmiddleware.js";

const productRouter = Router();

productRouter.post("/create",verifyToken,adminAuth, createProducts);
productRouter.get("/get-all", getProducts);
productRouter.get("/get/:id", getProductById);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);

export default productRouter;