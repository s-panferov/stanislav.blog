const stylexPlugin = require('@stylexjs/nextjs-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

module.exports = stylexPlugin({
  rootDir: __dirname,
  useCSSLayers: true,
})(nextConfig);
