import { CorsOptions } from "cors";
import config from "./env";

export const corsConfig: CorsOptions = {
  // Origins allowed to access the API
  origin:
    config.app.env === "production"
      ? process.env.CORS_ORIGIN?.split(",") || false // In production, use specific origins
      : true, // In development, allow all origins

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Allowed HTTP methods
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],

  // Allowed request headers
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-API-Key",
  ],

  // Headers exposed to the client
  exposedHeaders: ["X-Total-Count", "X-Page-Count", "Link"],

  // Preflight request cache time
  maxAge: 86400, // 24 hours

  // Handle preflight requests
  preflightContinue: false,

  // Provide successful OPTIONS status
  optionsSuccessStatus: 204,
};
