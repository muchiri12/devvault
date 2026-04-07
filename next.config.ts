import type { NextConfig } from "next";

const SUPABASE_HOSTNAME = "lfktrowluxvkvjthqevs.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOSTNAME,
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],  // Serve AVIF first, fall back to WebP
    minimumCacheTTL: 31536000,              // Cache images for 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        // Apply to ALL routes
        source: "/(.*)",
        headers: [
          // 1. CLICKJACKING PROTECTION
          // Prevents anyone from embedding DevVault in an invisible iframe
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // 2. MIME SNIFFING PROTECTION
          // Forces browser to trust file types, never guess (blocks disguised malware uploads)
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 3. REFERRER POLICY
          // Your URLs are not leaked to 3rd-party sites when users click external links
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 4. PERMISSIONS POLICY
          // Locks down device hardware — no rogue script can access camera, mic, or location
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // 5. CONTENT SECURITY POLICY (Report-Only mode — safe, nothing is blocked yet)
          // Monitor for violations first. Once verified clean, change to Content-Security-Policy.
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              // Next.js needs 'unsafe-inline' for its own injected styles & scripts
              `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
              `style-src 'self' 'unsafe-inline'`,
              // Allow images from your own domain + Supabase storage
              `img-src 'self' data: blob: https://${SUPABASE_HOSTNAME}`,
              // Allow API/auth connections to Supabase only
              `connect-src 'self' https://${SUPABASE_HOSTNAME} wss://${SUPABASE_HOSTNAME}`,
              // Allow fonts served locally by Next.js
              `font-src 'self'`,
              // Nobody can iframe DevVault
              `frame-src 'none'`,
              // Block Flash and old plugins entirely
              `object-src 'none'`,
              // Prevent base tag hijacking
              `base-uri 'self'`,
              // Only allow forms to submit to your own domain
              `form-action 'self'`,
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;