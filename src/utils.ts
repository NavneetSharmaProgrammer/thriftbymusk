


/**
 * Extracts the unique file ID from a standard Google Drive shareable link.
 * Google Drive links come in various formats, but the file ID is the crucial part.
 * This regex specifically looks for the pattern `/file/d/FILE_ID/`.
 *
 * @param url The full Google Drive shareable link (e.g., "https://drive.google.com/file/d/1L155sUH6LUapn_-sW0yzP99pFrdVdfLr/view?usp=drive_link").
 * @returns The extracted file ID string, or null if the pattern is not found.
 */
const getGoogleDriveFileId = (url: string): string | null => {
  if (!url) return null;
  // The regex captures the sequence of characters that are not a '/' following '/file/d/'.
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  // `match[1]` contains the captured group, which is the file ID.
  return match ? match[1] : null;
};

/**
 * Formats a Google Drive shareable link into a URL suitable for direct embedding in `<img>` or `<iframe>` tags.
 * Standard share links do not work for direct embedding.
 *
 * @param url The original Google Drive shareable link.
 * @param type Specifies whether the link is for an 'image' or a 'video', as they require different formats.
 * @param options An optional object for extra parameters, like image width or height for optimization.
 * @returns The formatted URL for embedding. If the original URL is not a valid Google Drive link, it is returned unchanged.
 */
export const formatGoogleDriveLink = (url:string, type: 'image' | 'video', options?: { width?: number, height?: number }): string => {
  // If the URL is empty or not a Google Drive link, return it as is.
  if (!url || !url.includes('drive.google.com')) {
    return url;
  }

  const fileId = getGoogleDriveFileId(url);
  // If we can't extract a file ID, we can't format it, so return the original.
  if (!fileId) {
    return url;
  }
  
  if (type === 'image') {
    // This format provides a direct link to the image content.
    // Appending `=w{width}` or `=h{height}` tells Google to serve a resized version of the image.
    let sizeParam = '';
    if (options?.width) {
      sizeParam = `=w${options.width}`;
    } else if (options?.height) {
        sizeParam = `=h${options.height}`;
    }
    return `https://lh3.googleusercontent.com/d/${fileId}${sizeParam}`;
  }

  if (type === 'video') {
    // This format provides a 'preview' version of the video, which is suitable for embedding in an `<iframe>`.
    // It includes the Google Drive player controls.
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  // Fallback to the original URL if the type is unrecognized.
  return url;
};

/**
 * Converts a File object into a base64 encoded string.
 * This is useful for embedding image data directly into API requests.
 * @param file The File object to convert.
 * @returns A promise that resolves with the base64 encoded string (without the data URI prefix).
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL like "data:image/png;base64,iVBORw0KGgo..."
      // We need to strip the "data:image/png;base64," part.
      const base64String = result.split(',')[1];
      if (base64String) {
          resolve(base64String);
      } else {
          reject(new Error("Could not convert file to base64 string."));
      }
    };
    reader.onerror = error => reject(error);
  });