import fs from "fs";

export const cleanupFile = (filePath?: string | null) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
};
