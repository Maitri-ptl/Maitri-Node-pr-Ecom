import { Router } from "express";
import { addToCart, getCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/get", getCart);
cartRouter.put("/increase/:id", increaseQuantity);
cartRouter.put("/decrease/:id", decreaseQuantity);
cartRouter.delete("/remove/:id", removeFromCart);
cartRouter.delete("/clear", clearCart);

export default cartRouter;