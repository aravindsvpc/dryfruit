// CDN Configuration for product images
export const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/';

/**
 * Constructs the full CDN image URL from a filename
 * Example: 'srisakhamabari.png' -> 'https://cdn.jsdelivr.net/gh/aravind20062025/srisakhamabari-images/srisakhamabari.png'
 * @param filename - The image filename (e.g., 'srisakhamabari.png')
 * @returns Full CDN URL
 */
export const getCdnImageUrl = (filename: string): string => {
  if (!filename) return '';
  // If it's already a full URL, return as is
  if (filename.startsWith('http')) return filename;
  // Otherwise, prepend the CDN base URL
  return `${CDN_BASE_URL}${filename}`;
};
