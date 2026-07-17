import { Router } from "express";
import userRouter from "./user.route.js";
import adminRouter from "./admin.route.js";
import productRouter from "./product.route.js";
import categoryRouter from "./category.route.js";
import cartRouter from "./cart.route.js";
import { adminAuth, verifyToken } from "../middlewares/authmiddleware.js";

const route = Router();

route.use('/user',userRouter);
route.use('/admin',adminRouter);
route.use('/product',productRouter);
route.use('/category',verifyToken,adminAuth,categoryRouter);
route.use('/cart',verifyToken,cartRouter);

export default route;