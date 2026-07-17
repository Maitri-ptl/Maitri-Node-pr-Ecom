import mongoose from "mongoose"

const db = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected..");
    } catch (error) {
        console.log(error.message);      
    }
}

export default db();