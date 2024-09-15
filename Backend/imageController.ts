import sharp from "sharp";
import fs from "fs";

export const controlBrightness = async (req, res) => {
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
};

export const controlContrast = async (req, res) => {
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
};

export const controlSaturation = async (req, res) => {
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
};

export const controlRotation = async (req, res) => {
  try {
    const { angle = 0 } = req.body; // Default angle is 0 degrees
    const format = req.body.format || "png";

    const tempImagePath = req.file?.path;

    if (!tempImagePath) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Get the original metadata (size) of the image
    const image = sharp(tempImagePath);
    const metadata = await image.metadata();

    // Rotate the image by the specified angle
    const outputBuffer = await image
      .rotate(parseInt(angle, 10), {
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
};

export const controlCrop = async (req, res) => {
  try {
    const { cropX, cropY, cropWidth, cropHeight } = req.body;
    const format = req.body.format || "png";
    const tempImagePath = req.file?.path;

    if (!tempImagePath || !cropX || !cropY || !cropWidth || !cropHeight) {
      return res
        .status(400)
        .json({ error: "Invalid crop data or no image provided" });
    }

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
};

export const controlFormat = async (req, res) => {
  try {
    const { format = "png" } = req.body; // Default format is PNG if not provided
    const tempImagePath = req.file?.path;

    if (!tempImagePath) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Convert image to the desired format (PNG or JPEG)
    const outputBuffer = await sharp(tempImagePath)
      .toFormat(format === "jpeg" ? "jpeg" : "png") // Convert to specified format
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
};

// Helper to delete temporary files
const deleteTempFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete temporary file:", err);
  });
};

async function generateLowQualityImage(
  highQualityBuffer: Buffer
): Promise<Buffer> {
  // Create low-quality image from the high-quality buffer
  const lowQualityBuffer = await sharp(highQualityBuffer)
    .resize(800) // Optional: Resize for faster preview (adjust size if necessary)
    .jpeg({ quality: 50 }) // Reduce quality to 50% for faster preview
    .toBuffer();

  return lowQualityBuffer;
}

// different code for test purpose
// let processedImagePath: string | null = null; // To store the path of the original-quality image

// // Route to handle image manipulation
// router.post("/manipulate", upload.single("image"), async (req, res) => {
//   const {
//     brightness,
//     contrast,
//     saturation,
//     rotate,
//     cropX,
//     cropY,
//     cropWidth,
//     cropHeight,
//     format,
//   } = req.body;

//   if (!req.file) {
//     return res.status(400).send("No image file uploaded.");
//   }

//   const imagePath = path.join(__dirname, req.file.path);
//   const processedPath = path.join(
//     __dirname,
//     "uploads",
//     `processed_${req.file.filename}.jpeg`
//   ); // Store processed image

//   try {
//     let image = sharp(imagePath);

//     // Apply crop, rotate, brightness, contrast, saturation adjustments
//     if (cropX && cropY && cropWidth && cropHeight) {
//       image = image.extract({
//         left: parseInt(cropX, 10),
//         top: parseInt(cropY, 10),
//         width: parseInt(cropWidth, 10),
//         height: parseInt(cropHeight, 10),
//       });
//     }
//     if (rotate) {
//       image = image.rotate(parseInt(rotate, 10), { background: "#ffffff" });
//     }
//     if (brightness || contrast || saturation) {
//       image = image.modulate({
//         brightness: brightness ? parseFloat(brightness) : 100,
//         lightness: contrast ? parseFloat(contrast) : 100,
//         saturation: saturation ? parseFloat(saturation) : 100,
//       });
//     }

//     // Save the processed full-quality image to disk
//     await image.toFile(processedPath);
//     processedImagePath = processedPath; // Store the path for later download

//     // Generate low-quality preview for immediate feedback
//     const lowQualityBuffer = await sharp(processedPath)
//       .resize(800)
//       // .jpeg({ quality: 100 })
//       .toBuffer();

//     // Send low-quality preview as response
//     res.writeHead(200, {
//       "Content-Type": `image/${format}`,
//       "Content-Length": lowQualityBuffer.length,
//     });
//     res.end(lowQualityBuffer, "binary");

//     // Optionally, delete the uploaded image after processing
//     // fs.unlink(imagePath, (err) => {
//     //   if (err) {
//     //     console.error("Error deleting the image file:", err);
//     //   }
//     // });
//   } catch (error) {
//     console.error("Error processing image:", error);
//     res.status(500).send("Error processing the image.");
//   }
// });

// // Route to download the full-quality image
// router.post("/download", (req, res) => {
//   const { format = "png" } = req.body;
//   if (!processedImagePath) {
//     return res.status(404).send("No image available for download.");
//   }

//   const outputFormat = format === "jpeg" ? "jpeg" : "png"; // Restrict formats to PNG or JPEG
//   const processedImage = sharp(processedImagePath);

//   // Convert the image to the requested format
//   processedImage
//     .toFormat(outputFormat)
//     .toBuffer()
//     .then((data) => {
//       const mimeType = outputFormat === "jpeg" ? "image/jpeg" : "image/png";
//       res.writeHead(200, {
//         "Content-Type": mimeType,
//         "Content-Length": data.length,
//         "Content-Disposition": `attachment; filename=full_quality_image.${outputFormat}`,
//       });
//       res.end(data, "binary");
//     })
//     .catch((error) => {
//       console.error("Error converting image:", error);
//       res.status(500).send("Error converting the image.");
//     });
// });
