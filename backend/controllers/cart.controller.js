import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const requestedQuantity = Number(quantity ?? 1);

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({ message: "quantity must be a positive whole number" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cartItem = await Cart.findOne({ product: productId, user: userId });

        if (cartItem) {
            cartItem.quantity += requestedQuantity;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                product: productId,
                user: userId,
                quantity: requestedQuantity
            });
        }

        return res.status(201).json({ message: "Added to cart", cartItem });

    } catch (error) {
        return res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.find({ user: userId }).populate({ path: "product", populate: { path: "category" } });
        return res.status(200).json({ message: "Cart fetched", cart });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
}

export const increaseQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { $inc: { quantity: 1 } },
            { new: true }
        );
        if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
        return res.status(200).json({ message: "Quantity increased", cartItem });
    } catch (error) {
        return res.status(500).json({ message: "Error updating cart", error: error.message });
    }
}

export const decreaseQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findOne({ _id: id, user: req.user.id });
        if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

        if (cartItem.quantity <= 1) {
            return res.status(200).json({ message: "Minimum quantity reached", cartItem });
        }

        cartItem.quantity -= 1;
        await cartItem.save();

        return res.status(200).json({ message: "Quantity decreased", cartItem });
    } catch (error) {
        return res.status(500).json({ message: "Error updating cart", error: error.message });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findOneAndDelete({ _id: id, user: req.user.id });
        if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
        return res.status(200).json({ message: "Item removed from cart", cartItem });
    } catch (error) {
        return res.status(500).json({ message: "Error removing item", error: error.message });
    }
}

export const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ user: req.user.id });
        return res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        return res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
}
