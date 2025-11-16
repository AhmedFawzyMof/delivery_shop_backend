import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function convertToWebp(
  inputPath: string,
  outputDir: string
): Promise<string> {
  const fileName = path.basename(inputPath, path.extname(inputPath)) + ".webp";
  const outputPath = path.join(outputDir, fileName);

  await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

  fs.unlinkSync(inputPath);

  return fileName;
}
