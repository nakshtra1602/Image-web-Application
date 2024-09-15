import { Router } from "express";
import multer from "multer";
import {
  controlBrightness,
  controlContrast,
  controlCrop,
  controlFormat,
  controlRotation,
  controlSaturation,
} from "./imageController";

const router = Router();

// // Set up multer to temporarily store uploaded files in the "uploads" directory
const upload = multer({ dest: "uploads/" });

// Define __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Endpoint to adjust brightness
router.post("/adjust-brightness", upload.single("image"), controlBrightness);

// Endpoint to adjust contrast
router.post("/adjust-contrast", upload.single("image"), controlContrast);

// Endpoint to adjust saturation
router.post("/adjust-saturation", upload.single("image"), controlSaturation);

// Endpoint for rotating the image
router.post("/adjust-rotation", upload.single("image"), controlRotation);

// Endpoint to crop the image
router.post("/crop", upload.single("image"), controlCrop);

// Endpoint to download the final image in the desired format
router.post("/change-format", upload.single("image"), controlFormat);

export default router;
