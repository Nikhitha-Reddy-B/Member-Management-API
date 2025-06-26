import sharp from 'sharp';
import fs from 'fs';

export const compressImage = async (filePath: string) => {
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);

  if (fileSizeMB > 25) {
    const outputPath = filePath.replace(/(\.\w+)$/, '-compressed$1');
    await sharp(filePath)
      .jpeg({ quality: 70 }) // compress to ~70% quality
      .toFile(outputPath);

    fs.unlinkSync(filePath); // remove original
    return outputPath;
  }

  return filePath;
};
