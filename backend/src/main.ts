import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import authRouter from "./routes/auth.routes";
import initializeConfig from "./configs/initializeSiteConfig";
import { errorMiddleware } from "./packages/error-handler/error-middleware";
const swaggerDocument = JSON.parse(readFileSync("swagger-output.json", "utf8"));

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://e-comerce-assignment.vercel.app",
      "https://e-comerce-assignment.onrender.com"
    ],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

//swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (_req, res) => {
  res.json(swaggerDocument);
});

// Example route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send({ message: "Health of Growlance server is Good..." });
});

app.use("/api", authRouter);
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  try {
    initializeConfig();
    console.log("site config is initialized successfully");
  } catch (error) {
    console.log("Error while Initialized site config", error);
  }
});

server.on("error", (err) => {
  console.log(`Error while starting the server`, err);
});
