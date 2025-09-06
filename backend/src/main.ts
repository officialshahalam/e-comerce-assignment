import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import authRouter from "./routes/auth.routes";
import { errorMiddleware } from "./packages/error-handler/error-middleware";
const swaggerDocument = await import("./swagger-output.json", {
  with: { type: "json" },
});

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://growlance-sh.vercel.app"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

//swagger doc
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/docs-json", (_req, res) => {
  res.json(swaggerDocument);
});

// Example route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send({ message: "Health of Growlance server is Good..." });
});

app.use("/auth/api", authRouter);
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.log(`Error while starting the server`, err);
});
