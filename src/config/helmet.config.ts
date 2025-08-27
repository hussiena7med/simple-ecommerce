import { HelmetOptions } from "helmet";
import config from "./env";

export const helmetConfig: HelmetOptions = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  // Cross Origin Embedder Policy
  crossOriginEmbedderPolicy: config.app.env === "production",

  // Cross Origin Opener Policy
  crossOriginOpenerPolicy: { policy: "same-origin" },

  // Cross Origin Resource Policy
  crossOriginResourcePolicy: { policy: "cross-origin" },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },

  // Frame Guard
  frameguard: { action: "deny" },

  // Hide Powered By Header
  hidePoweredBy: true,

  // HTTP Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: config.app.env === "production",
  },

  // IE No Open
  ieNoOpen: true,

  // No Sniff
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross Domain Policies
  permittedCrossDomainPolicies: false,

  // Referrer Policy
  referrerPolicy: { policy: ["no-referrer"] },

  // X-XSS-Protection
  xssFilter: true,
};
