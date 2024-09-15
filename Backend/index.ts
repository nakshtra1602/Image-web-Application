import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import routes from "./routes";
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to Image Processing app",
  });
});

app.use("/api", routes);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
