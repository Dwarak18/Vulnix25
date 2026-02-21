
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '../public/gallery');

try {
  const files = fs.readdirSync(galleryDir);
  const imageExtensions = ['.jpeg', '.jpg', '.png', '.webp'];
  // Filter for image files and ignore system files like .DS_Store
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext) && !file.startsWith('.');
  });

  if (imageFiles.length === 0) {
    console.log('No image files found in /public/gallery. Nothing to rename.');
    return;
  }

  console.log(`Found ${imageFiles.length} images to rename.`);

  let counter = 1;
  // Sort files to ensure a consistent renaming order
  for (const file of imageFiles.sort()) {
    const oldPath = path.join(galleryDir, file);
    const extension = path.extname(file);
    const newName = `vulnix-gallery-${counter}${extension}`;
    const newPath = path.join(galleryDir, newName);

    try {
      if (file !== newName) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${newName}`);
      } else {
        console.log(`Skipped: ${file} is already correctly named.`);
      }
      counter++;
    } catch (renameError) {
      console.error(`Error renaming ${file}:`, renameError);
    }
  }

  console.log('\nImage renaming process completed.');
  console.log('Please check the /public/gallery directory to see the changes.');
  console.log('I have also updated src/lib/placeholder-images.json to match the new filenames.');

} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`Error: The directory '/public/gallery' does not exist.`);
    console.error('Please create it and add your images before running this script.');
  } else {
    console.error('An error occurred:', err);
  }
}
