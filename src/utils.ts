
/**
 * Extracts the unique file ID from a standard Google Drive shareable link.
 * Google Drive links come in various formats, but the file ID is the crucial part.
 * This regex specifically looks for the pattern `/file/d/FILE_ID/`.
 *
 * @param url The full Google Drive shareable link (e.g., "https://drive.google.com/file/d/1L155sUH6LUapn_-sW0yzP99pFrdVdfLr/view?usp=drive_link").
 * @returns The extracted file ID string, or null if the pattern is not found.
 */
export const getGoogleDriveFileId = (url: string): string | null => {
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
    // This format attempts to get a direct viewable link for the video file, suitable for a <video> tag.
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Fallback to the original URL if the type is unrecognized.
  return url;
};