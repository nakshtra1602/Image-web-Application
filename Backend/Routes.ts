import { Router } from "express";
import sharp from "sharp";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

// Set up multer to temporarily store uploaded files in the "uploads" directory
const upload = multer({ dest: "uploads/" });

// API to upload an image and adjust brightness, contrast, or saturation
router.post("/adjust-brightness", upload.single("image"), async (req, res) => {
  try {
    const { brightness = 100 } = req.body;
    const format = req.body.format || "png";

    // Path to the uploaded image file
    const tempImagePath = req.file.path;

    if (!tempImagePath) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Process the image using sharp with brightness, contrast, and saturation values
    const outputBuffer = await sharp(tempImagePath)
      .modulate({
        brightness: parseFloat(brightness) / 100,
      })
      .toBuffer();

    // Send the processed image back to the client as a response
    res.writeHead(200, { "Content-Type": `image/${format}` });
    res.end(outputBuffer, "binary");
  } catch (error) {
    console.error("Error processing brightness:", error);
    res.status(500).json({ error: "Error processing brightness" });
  }
});
router.post("/adjust-contrast", upload.single("image"), async (req, res) => {
  try {
    const { contrast = 100 } = req.body;
    const format = req.body.format || "png";

    // Path to the uploaded image file
    const tempImagePath = req.file?.path;

    if (!tempImagePath) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Process the image using sharp with brightness, contrast, and saturation values
    const outputBuffer = await sharp(tempImagePath)
      .modulate({
        lightness: parseFloat(contrast) / 100,
      })
      .toBuffer();

    // Send the processed image back to the client as a response
    res.writeHead(200, { "Content-Type": `image/${format}` });
    res.end(outputBuffer, "binary");
  } catch (error) {
    console.error("Error processing contrast:", error);
    res.status(500).json({ error: "Error processing contrast" });
  }
});
router.post("/adjust-saturation", upload.single("image"), async (req, res) => {
  try {
    const { saturation = 100 } = req.body;
    const format = req.body.format || "png";

    // Path to the uploaded image file
    const tempImagePath = req.file?.path;

    if (!tempImagePath) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Process the image using sharp with brightness, contrast, and saturation values
    const outputBuffer = await sharp(tempImagePath)
      .modulate({
        saturation: parseFloat(saturation) / 100,
      })
      .toBuffer();

    // Send the processed image back to the client as a response
    res.writeHead(200, { "Content-Type": `image/${format}` });
    res.end(outputBuffer, "binary");
  } catch (error) {
    console.error("Error processing saturation:", error);
    res.status(500).json({ error: "Error processing saturation" });
  }
});

// Endpoint for rotating the image
router.post("/adjust-rotation", upload.single("image"), async (req, res) => {
  const { angle = 0 } = req.body; // Default angle is 0 degrees
  const format = req.body.format || "png";

  const tempImagePath = req.file?.path;

  if (!tempImagePath) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    // Rotate the image by the specified angle
    const outputBuffer = await sharp(tempImagePath)
      .rotate(parseFloat(angle)) // Rotate by the angle specified
      .toBuffer();

    // Send the rotated image back as a response
    res.writeHead(200, { "Content-Type": `image/${format}` });
    res.end(outputBuffer, "binary");
  } catch (error) {
    console.error("Error processing image rotation:", error);
    res.status(500).json({ error: "Error processing image rotation" });
  }
});

// Endpoint to crop the image
router.post("/crop", upload.single("image"), async (req, res) => {
  const { cropX, cropY, cropWidth, cropHeight } = req.body;
  const format = req.body.format || "png";
  const tempImagePath = req.file?.path;

  if (!tempImagePath || !cropX || !cropY || !cropWidth || !cropHeight) {
    return res
      .status(400)
      .json({ error: "Invalid crop data or no image provided" });
  }

  try {
    // Convert crop values to numbers
    const cropXNum = parseFloat(cropX);
    const cropYNum = parseFloat(cropY);
    const cropWidthNum = parseFloat(cropWidth);
    const cropHeightNum = parseFloat(cropHeight);

    // Crop the image using sharp
    const outputBuffer = await sharp(tempImagePath)
      .extract({
        left: cropXNum,
        top: cropYNum,
        width: cropWidthNum,
        height: cropHeightNum,
      })
      .toBuffer();

    // Send the cropped image back as a response
    res.writeHead(200, { "Content-Type": `image/${format}` });
    res.end(outputBuffer, "binary");
  } catch (error) {
    console.error("Error cropping image:", error);
    res.status(500).json({ error: "Error cropping image" });
  }
});

export default router;
