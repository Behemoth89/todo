/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, '.');
    return config;
  },
}