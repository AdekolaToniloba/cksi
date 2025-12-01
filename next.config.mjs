/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            // UPDATED POLICY BELOW:
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.paystack.co https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline' https://paystack.com https://fonts.googleapis.com;
              img-src 'self' blob: data: https://res.cloudinary.com https://*.paystack.com https://assets.paystack.com https://www.google-analytics.com;
              font-src 'self' data: https://fonts.gstatic.com;
              frame-src 'self' https://js.paystack.co https://checkout.paystack.com https://standard.paystack.co;
              connect-src 'self' ws: wss: https://js.paystack.co https://checkout.paystack.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

export default nextConfig
