import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({extended : true}));

//base route
app.get("/", (req,res)=>{
    res.send("ConstituCheck Backend is running!");
});

//load routes
app.use("/api", routes);

//fallback error handler
app.use((req, res)=>{
    res.status(404).json({message: "Route not found"});
});

//start the server
const PORT = process.env.PORT || 2324 ;
app.listen(PORT, ()=>{
    console.log(`Server is running on htt://localhost:${PORT}`);
});

export default app;