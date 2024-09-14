import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const API = "http://localhost:8080/api";

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null); // Original image
  const [processedImage, setProcessedImage] = useState<string | null>(null); // Store latest processed image
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Preview Image
  const [format, setFormat] = useState<string>("jpeg"); // Image format for downloading
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);

  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
      setPreviewImage(URL.createObjectURL(event.target.files[0])); //For initial view of Image
      setProcessedImage(null); // Reset processed image when a new image is selected
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setRotation(0);
    }
  };

  const handleImageProcessing = async (type: string) => {
    if (!image && !processedImage) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("format", format);
    // Send either the original or the last processed image
    if (processedImage) {
      formData.append("image", processedImage); // Use last processed image
    } else if (image) {
      formData.append("image", image); // Use the original file on first manipulation
    }

    let endpoint = "";
    switch (type) {
      case "brightness":
        formData.append("brightness", brightness.toString());
        endpoint = `${API}/adjust-brightness`;
        break;
      case "contrast":
        formData.append("contrast", contrast.toString());
        endpoint = `${API}/adjust-contrast`;
        break;
      case "saturation":
        formData.append("saturation", saturation.toString());
        endpoint = `${API}/adjust-saturation`;
        break;
      case "rotation":
        formData.append("angle", rotation.toString());
        endpoint = `${API}/adjust-rotation`;
        break;

      default:
        return;
    }

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(response.data); // Store the new processed image
      setPreviewImage(imageUrl); // Update preview Image
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  // Submit the cropped area to the backend
  const handleCrop = async () => {
    if (!image) {
      alert("Please select an image file and crop area.");
      return;
    }

    const cropData = new FormData();
    if (processedImage) {
      cropData.append("image", processedImage);
    } else if (image) {
      cropData.append("image", image);
    }
    cropData.append("cropX", crop.x?.toString() || "0");
    cropData.append("cropY", crop.y?.toString() || "0");
    cropData.append("cropWidth", crop.width?.toString() || "0");
    cropData.append("cropHeight", crop.height?.toString() || "0");

    try {
      const response = await axios.post(`${API}/crop`, cropData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(response.data);
      setPreviewImage(imageUrl); // Display cropped preview
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // Download final image in the selected format
  const handleDownload = async () => {
    if (!processedImage) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", processedImage);
    formData.append("format", format); // Append the selected format (png/jpeg)

    try {
      const response = await axios.post(`${API}/change-format`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Expect binary response for the image
      });
      // Create a URL for the final image and trigger download
      const imageUrl = URL.createObjectURL(response.data);
      // Trigger download in the browser
      const link = document.createElement("a");
      link.href = imageUrl;
      link.setAttribute("download", `final_image.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="container-fluid m-3 p-3">
      <div className="mb-3">
        <label className="btn btn-outline-secondary col-md-6">
          {image ? image.name : "Upload Photo"}
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>
      </div>
      <div className="row container">
        <div className="col-md-6">
          <h2>Adjust Image Properties</h2>
          <div>
            <label>Brightness</label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => {
                setBrightness(parseInt(e.target.value));
                handleImageProcessing("brightness");
              }}
            />
          </div>
          <div>
            <label>Contrast</label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => {
                setContrast(parseInt(e.target.value));
                handleImageProcessing("contrast");
              }}
            />
          </div>
          <div>
            <label>Saturation</label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => {
                setSaturation(parseInt(e.target.value));
                handleImageProcessing("saturation");
              }}
            />
          </div>
          <div>
            <label>Rotation (0-360°)</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => {
                setRotation(parseInt(e.target.value));
                handleImageProcessing("rotation");
              }}
            />
            <span>{rotation}°</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            {previewImage && (
              <div className="text-center">
                <img
                  src={previewImage}
                  alt="product_photo"
                  height={"200px"}
                  className="img img-responsive"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {previewImage && (
          <div style={{ marginTop: "10px" }}>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              <img src={previewImage} />
            </ReactCrop>
          </div>
        )}
      </div>
      <button onClick={handleCrop}>Apply Crop</button>
      <div>
        <label>Select in which Format to Download:</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
        </select>
      </div>

      <button onClick={handleDownload}>Download Image</button>
    </div>
  );
};

export default ImageUpload;
