import sharp from 'sharp';
import fs from 'fs';

export const compressImage = async (filePath: string): Promise<string>=> {
  if(!fs.existsSync(filePath)){
    throw new Error(`File not found for compression`);
  }
  
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);

  if (fileSizeMB > 25) {
    const outputPath = filePath.replace(/(\.\w+)$/, '-compressed$1');
    await sharp(filePath)
      .jpeg({ quality: 70 }) 
      .toFile(outputPath);

    fs.unlinkSync(filePath); 
    return outputPath;
  }

  return filePath;
};
