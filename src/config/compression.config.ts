import compression from "compression";
import config from "./env";

export const compressionConfig: compression.CompressionOptions = {
  // Compression level (1-9, 6 is default)
  level: 6,

  // Minimum response size to compress
  threshold: 1024, // 1KB

  // Filter function to determine what to compress
  filter: (req, res) => {
    // Don't compress responses with this request header
    if (req.headers["x-no-compression"]) {
      return false;
    }

    // Use compression filter function
    return compression.filter(req, res);
  },

  // Memory level (1-9, 8 is default)
  memLevel: 8,

  // Window bits
  windowBits: 15,

  // Chunk size
  chunkSize: 16 * 1024, // 16KB
};
