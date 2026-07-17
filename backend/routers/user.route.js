import { Router } from "express";
import { deleteProfile, getAllUsers, loginUser, profile, registerUser, updateProfile } from "../controllers/user.controller.js";
import { adminAuth, verifyToken, verifyUser } from "../middlewares/authmiddleware.js";

const userRouter = Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-all/',verifyToken,adminAuth,getAllUsers)
userRouter.get('/profile/:id',verifyToken,verifyUser,profile)
userRouter.patch('/profile/:id',verifyToken,verifyUser,updateProfile)
userRouter.delete('/profile/:id',verifyToken,verifyUser,deleteProfile)

export default userRouter;