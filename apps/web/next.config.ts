import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@speedtype/shared', '@speedtype/typing-engine'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;

