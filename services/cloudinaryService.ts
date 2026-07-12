import * as ImageManipulator from 'expo-image-manipulator';

// SETUP INSTRUCTIONS
// 1. Go to https://cloudinary.com and create a free account
// 2. Note your Cloud Name from the dashboard
// 3. Go to Settings → Upload → Upload presets → Add upload preset
//    - Signing Mode: Unsigned 
//    - Folder: leave blank
// 4. Copy the Cloud Name and preset name below

const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UNSIGNED_UPLOAD_PRESET';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const generateUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const uploadImage = async (localUri: string, folder: 'items' | 'avatars'): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      localUri,
      [{ resize: { width: 2048 } }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    const formData = new FormData();
    const filename = `${generateUuid()}.jpg`;
    
    formData.append('file', {
      uri: manipResult.uri,
      type: 'image/jpeg',
      name: filename,
    } as any);
    
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `vesture/${folder}`);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  // Deleting from the client requires a signed request (needs API secret), which
  // must NOT live in the app. Implemented as a no-op per spec.
  console.log('Image deletion is intentionally a no-op on the client:', publicId);
};
