// src/context/ImageContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";
import { type Crop } from "react-image-crop";

interface ImageContextType {
  image: File | null;
  processedImage: string | null;
  previewImage: string | null;
  format: string;
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  crop: Crop;
  setImage: (file: File | null) => void;
  setProcessedImage: (url: string | null) => void;
  setPreviewImage: (url: string | null) => void;
  setFormat: (format: string) => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  setSaturation: (value: number) => void;
  setRotation: (value: number) => void;
  setCrop: (crop: Crop) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("png");
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  return (
    <ImageContext.Provider
      value={{
        image,
        processedImage,
        previewImage,
        format,
        brightness,
        contrast,
        saturation,
        rotation,
        crop,
        setImage,
        setProcessedImage,
        setPreviewImage,
        setFormat,
        setBrightness,
        setContrast,
        setSaturation,
        setRotation,
        setCrop,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook
export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
