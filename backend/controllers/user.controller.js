import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({...req.body, password: hashedPassword });  
    return res.status(201).json({message : "User registered succesfully.."}) 

  }catch (error) {
    return res.status(500).json({ message: error.message});
  }
}

export const loginUser = async(req,res)=>{
  try {
    const {email,password} = req.body;

    if(!email || !password){
      return res.status(400).json({message : "Please Enter data"})
    }

    const user = await User.findOne({email});

    if(!user) return res.status(404).json({message : "User not Found"})

    const isValid = await bcrypt.compare(password,user.password)

    if(!isValid) return res.status(400).json({message : "Invalid password"})

    const payload = {
      id : user.id,
      name : user.name,
      role : user.role
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn : '1h'})

    return res.status(200).json({message : "Login Successfully..",userId : user.id,token})

  } catch (error) {
    return res.status(500).json({message : error.message})
  }
}

export const profile = async(req,res)=>{
  try {
    const {id} = req.params; 
    const user = await User.findById(id);
    if(!user) return res.status(404).json({message : "User not Found"})
    return res.status(200).json({message : "User Profile", user})
  }catch (error) {
    return res.status(500).json({message : error.message})
  }
}

export const getAllUsers = async(req,res)=>{
  try {
    const users = await User.find();  
    return res.status(200).json({message : "All Users", users})
  }catch (error) {
    return res.status(500).json({message : error.message})
  }
}

export const updateProfile = async(req,res)=>{
  try {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,req.body,{new : true});
    if(!user) return res.status(404).json({message : "User not Found"})
    return res.status(200).json({message : "User Profile Updated", user})
  }catch (error) {
    return res.status(500).json({message : error.message})
  } 
}

export const deleteProfile = async(req,res)=>{
  try {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if(!user) return res.status(404).json({message : "User not Found"})
    return res.status(200).json({message : "User Profile Deleted"})
  }catch (error) {
    return res.status(500).json({message : error.message})
  }
}

