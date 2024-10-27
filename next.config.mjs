/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,  // Use SWC for minification instead of Terser
  ...nextI18NextConfig,  // Spread the i18n configuration into the Next.js config
};

export default nextConfig;
