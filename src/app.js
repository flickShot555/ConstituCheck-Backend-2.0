// src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { initFirebase } from "./config/firebaseConfig.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
initFirebase(); // initialize firebase-admin (reads service account from ENV)

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// api routes
app.use("/api", routes);

// health route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`Node backend listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;
