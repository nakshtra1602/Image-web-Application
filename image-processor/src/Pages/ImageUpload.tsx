import React, { useEffect, useState } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";

const API = "http://locahost:8080/api";

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("png");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Cropping state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
      // setPreviewImage(event.target.files[0]);
    }
  };

  const handleImageProcessing = async (type: string) => {
    if (!image) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("format", format);

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
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  // Capture crop area in pixels
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Submit the cropped area to the backend
  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) {
      alert("Please select an image file and crop area.");
      return;
    }

    const cropData = new FormData();
    cropData.append("image", image);
    cropData.append("cropX", croppedAreaPixels.x.toString());
    cropData.append("cropY", croppedAreaPixels.y.toString());
    cropData.append("cropWidth", croppedAreaPixels.width.toString());
    cropData.append("cropHeight", croppedAreaPixels.height.toString());

    try {
      const response = await axios.post(`${API}/crop`, cropData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setPreviewImage(imageUrl); // Display cropped preview
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // console.log("joker",image)

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
      {/* <button onClick={handleImageUpload}>Upload and Process</button> */}
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
              onChange={(e) => setBrightness(parseInt(e.target.value))}
            />
            <button onClick={() => handleImageProcessing("brightness")}>
              Apply Brightness
            </button>
          </div>
          <div>
            <label>Contrast</label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
            />
            <button onClick={() => handleImageProcessing("contrast")}>
              Apply Contrast
            </button>
          </div>
          <div>
            <label>Saturation</label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
            />
            <button onClick={() => handleImageProcessing("saturation")}>
              Apply Saturation
            </button>
          </div>
          <div>
            <label>Rotation (0-360°)</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
            />
            <span>{rotation}°</span>
            <button onClick={() => handleImageProcessing("rotation")}>
              Apply Rotation
            </button>
          </div>
        </div>
        <div className="col-md-6">
          {previewImage && <img src={previewImage} alt="Preview" />}
          <div className="mb-3">
            {image && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt="product_photo"
                  height={"200px"}
                  className="img img-responsive"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {image && (
        <div style={{ position: "relative", width: "30%", height: 200 }}>
          <Cropper
            image={URL.createObjectURL(image)}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} // You can adjust this aspect ratio as needed
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <button onClick={handleCrop}>Apply Crop</button>
      {previewImage && <img src={previewImage} alt="Cropped Preview" />}

      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
      </select>
    </div>
  );
};

export default ImageUpload;
