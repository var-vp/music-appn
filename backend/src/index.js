import express from "express";
import dotenv from "dotenv";
import userRoutes from "./Routes/user.route.js";
import adminRoutes from "./Routes/admin.route.js";
import authRoutes from "./Routes/auth.route.js";
import songRoutes from "./Routes/song.route.js";
import statRoutes from "./Routes/stat.route.js";
import albumRoutes from "./Routes/album.route.js";
import reviewRoutes from "./Routes/review.js";
import mongoose from "mongoose";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import {initializeSocket} from "./lib/socket.js";
import { createServer } from "http";


dotenv.config();
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));

app.use(express.json()); //middleware to parse req.body
app.use(clerkMiddleware()); //this will add auth to request object => req.auth
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:path.join(__dirname,"tmp"),
    createParentPath:true,
    limits:{
        fileSize:10*1024*1024, //10MB max file size
    }
}));

mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statRoutes);
app.use("/api/reviews", reviewRoutes);

// error handler
app.use((err,req,res,next) => {
    res.status(500).json({message:process.env.NODE_ENV === "production"? "Internal server error":err.message});
});

httpServer.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
    connectDB();
});