import fs from "fs";
import path from "path";

export const saveSelfie = async ({
  id,
  file,
  base64,
}: {
  id: number;
  file?: Express.Multer.File;
  base64?: string;
}): Promise<string> => {
  if (!file && !base64) throw new Error("Missing selfie image");

  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "images",
    "drivers",
    `${id}`,
    "selfies"
  );
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  if (file) return file.path;

  const matches = base64!.match(/^data:(.+);base64,(.+)$/);
  const ext = matches ? matches[1].split("/")[1] : "png";
  const base64Data = matches ? matches[2] : base64!;
  const buffer = Buffer.from(base64Data, "base64");

  const selfiePath = path.join(
    uploadsDir,
    `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
  );

  fs.writeFileSync(selfiePath, buffer);

  const publicDir = path.join(process.cwd(), "public");
  const relative = selfiePath.replace(publicDir, "").replace(/\\/g, "/");
  return relative;
};
