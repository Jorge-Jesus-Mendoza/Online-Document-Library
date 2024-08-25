/** @type {import('next').NextConfig} */
const nextConfig = {

    
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
