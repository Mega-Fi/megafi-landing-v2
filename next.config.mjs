/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Suppress warnings from external wallet connector dependencies
    config.ignoreWarnings = [
      // Ignore missing optional dependencies from wallet connectors
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/pino/ },
      { module: /node_modules\/@react-native-async-storage/ },
      { module: /node_modules\/pino-pretty/ },
    ];

    // Fallback for optional dependencies that aren't needed in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "@react-native-async-storage/async-storage": false,
        "pino-pretty": false,
      };
    }

    return config;
  },
};

export default nextConfig;
