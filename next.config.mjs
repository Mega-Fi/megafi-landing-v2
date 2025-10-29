/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Don't attempt to load CDN modules on the server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js': 'commonjs https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
      });
    }
    return config;
  },
};

export default nextConfig;

