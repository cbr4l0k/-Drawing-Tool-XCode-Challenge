/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/Drawing-Tool-XCode-Challenge',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '/Drawing-Tool-XCode-Challenge',
    output: 'export',
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
