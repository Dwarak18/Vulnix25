
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '../public/gallery');
const jsonPath = path.join(__dirname, '../src/lib/placeholder-images.json');

try {
  const files = fs.readdirSync(galleryDir);
  const imageExtensions = ['.jpeg', '.jpg', '.png', '.webp'];
  // Filter for image files and ignore system files like .DS_Store
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext) && !file.startsWith('.');
  });

  if (imageFiles.length === 0) {
    console.log('No image files found in /public/gallery. Nothing to rename or update.');
    // Optionally, write an empty array to the JSON file
    fs.writeFileSync(jsonPath, JSON.stringify([], null, 2));
    console.log('src/lib/placeholder-images.json has been cleared.');
    return;
  }

  console.log(`Found ${imageFiles.length} images to process.`);

  const newImageList = [];
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
        console.log(`Skipped renaming: ${file} is already correctly named.`);
      }

      // Add to our new JSON list
      newImageList.push({
        id: counter,
        src: `/gallery/${newName}`,
        alt: `VULNIX Event Image ${counter}`,
        // A generic hint, can be improved manually later
        hint: `event photo`
      });

      counter++;
    } catch (renameError) {
      console.error(`Error processing ${file}:`, renameError);
    }
  }

  // Write the updated list to the JSON file
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(newImageList, null, 2));
    console.log(`\nSuccessfully updated src/lib/placeholder-images.json with ${newImageList.length} entries.`);
  } catch (writeError) {
    console.error('\nError writing to src/lib/placeholder-images.json:', writeError);
  }

  console.log('\nImage processing complete.');
  console.log('Please check the /public/gallery directory and the updated JSON file.');

} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`Error: The directory '/public/gallery' does not exist.`);
    console.error('Please create it and add your images before running this script.');
  } else {
    console.error('An error occurred:', err);
  }
}
