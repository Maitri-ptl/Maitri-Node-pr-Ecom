import express from 'express'
import "dotenv/config"
import db from "./configs/database.js"
import bodyParser from 'body-parser';
import route from './routers/index.js';
import cors from "cors"

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api',route)

app.listen(port,(error)=>{
    if(!error){
        console.log("Server started..");
        console.log(`http://localhost:${port}`); 
        return; 
    }
    console.log(error.message);
})