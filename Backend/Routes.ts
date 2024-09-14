import { Router } from "express";
import sharp from "sharp";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

// Set up multer to temporarily store uploaded files in the "uploads" directory
const upload = multer({ dest: "uploads/" });

// Helper to delete temporary files
const deleteTempFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete temporary file:", err);
  });
};

// async function generateLowQualityImage(highQualityBuffer: Buffer): Promise<Buffer> {
//   // Create low-quality image from the high-quality buffer
//   const lowQualityBuffer = await sharp(highQualityBuffer)
//     .resize(800)  // Optional: Resize for faster preview (adjust size if necessary)
//     .jpeg({ quality: 50 })  // Reduce quality to 50% for faster preview
//     .toBuffer();

//   return lowQualityBuffer;
// }

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
    // Get the original metadata (size) of the image
    const image = sharp(tempImagePath);
    const metadata = await image.metadata();

    // Rotate the image by the specified angle
    const outputBuffer = await image
      .rotate(parseFloat(angle), {
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      }) // Rotate by the angle specified and white background
      .resize(metadata.width, metadata.height, { fit: "contain" }) // Maintain original size
      .withMetadata()
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
    // const cropXNum = parseFloat(cropX);
    // const cropYNum = parseFloat(cropY);
    // const cropWidthNum = parseFloat(cropWidth);
    // const cropHeightNum = parseFloat(cropHeight);

    // Crop the image using sharp
    const outputBuffer = await sharp(tempImagePath)
      .extract({
        left: parseInt(cropX, 10),
        top: parseInt(cropY, 10),
        width: parseInt(cropWidth, 10),
        height: parseInt(cropHeight, 10),
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

// Endpoint to download the final image in the desired format
router.post("/change-format", upload.single("image"), async (req, res) => {
  const { format = "jpeg" } = req.body; // Default format is JPEG if not provided
  const tempImagePath = req.file?.path;

  if (!tempImagePath) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    // Convert image to the desired format (PNG or JPEG)
    const outputBuffer = await sharp(tempImagePath)
      .toFormat(format === "png" ? "png" : "jpeg") // Convert to specified format
      .toBuffer();

    // Set appropriate content type for the selected format
    res.writeHead(200, { "Content-Type": `image/${format}` });
    res.end(outputBuffer, "binary");

    // Clean up the temporary file after sending
    //   deleteTempFile(tempImagePath);
  } catch (error) {
    console.error("Error processing image download:", error);
    res.status(500).json({ error: "Error processing image download" });
  }
});

export default router;
