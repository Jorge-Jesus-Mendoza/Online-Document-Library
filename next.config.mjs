/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co'
      },
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net'
      }
    ]
  },
  
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[hash][ext][query]",
      },
    });
    return config;
  },
};

export default nextConfig;
