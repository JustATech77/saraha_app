import path from "node:path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "./config/.env.dev") });
import express from "express";
import connect from "./config/connection.db.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import { globalErrorHandling } from "./utils/response/response.js";
import cors from "cors";

const bootstrap = async () => {
  try {
    const app = express();
    const port = process.env.PORT;
    // connect to database
    await connect();
    app.use("/uploads", express.static(path.resolve("./src/uploads")));
    app.use(express.json()); // parse json body
    app.use(cors()); // cors
    // routes
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    // not found route
    app.all("{/*dahhhhhhhhh}", (req, res) => {
      res.status(404).json({ message: "Page Not Found" });
    });
    // global error handling
    app.use(globalErrorHandling);

    // start server
    app.listen(port, () => {
      console.log(`Server run on port ${port}`);
    });
  } catch (error) {}
};
export default bootstrap;
