import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { log } from "console";

import noteRoute from "./route/notes.route.js"


import connectToMongoDB from "./db/connectToMongoDB.js";


const app = express();

dotenv.config();

const port = 8000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/note", noteRoute);

app.use(express.static(path.join(__dirname, "frontend", "dist")));




// IDK whats the problem with this line but its giving pathToRegexpError which i cant resolve 

// app.get("*", (req, res) => {
// res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });



app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server running at http://localhost:${port}`);
});