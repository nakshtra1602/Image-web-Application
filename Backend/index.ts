import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import routes from "./Routes";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Define __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to Image Processing app",
  });
});

// app.get("/api/download/:filename", (req: Request, res: Response) => {
//   const format = req.query.format || "png";
//   const filename = req.params.filename;

//   res.download(
//     path.join(__dirname, "uploads", filename),
//     `processed.${format}`
//   );
// });

app.use("/api", routes);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
