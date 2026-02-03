import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { convertToWebp } from "./imageconverter";

export const handleImageUpload = async (
  imageData: string | Express.Multer.File,
  finalDir: string,
): Promise<string> => {
  let imageUrl = "";

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  if (typeof imageData === "string") {
    // Base64 image
    const base64Data = imageData.split(";base64,").pop();
    if (!base64Data) {
      throw new Error("Invalid base64 image data");
    }
    const imageBuffer = Buffer.from(base64Data, "base64");
    const fileName = `${uuidv4()}.png`;
    const filePath = path.join(finalDir, fileName);
    fs.writeFileSync(filePath, imageBuffer);

    const webpFileName = await convertToWebp(filePath, finalDir);
    imageUrl = `/${finalDir.split(path.sep).slice(1).join(path.sep)}/${webpFileName}`;
  } else if (imageData && imageData.path) {
    // Multer file
    const webpFileName = await convertToWebp(imageData.path, finalDir);
    imageUrl = `/${finalDir.split(path.sep).slice(1).join(path.sep)}/${webpFileName}`;
  }

  return imageUrl;
};