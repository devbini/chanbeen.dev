/** @type {import('next').NextConfig} */

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

const imageHostname = imageBaseUrl ? imageBaseUrl.replace('https://', '') : null;

const nextConfig = {
    images: {
        remotePatterns: imageHostname ? [
            {
                protocol: 'https',
                hostname: imageHostname,
                port: '',
                pathname: '/**',
            },
        ] : [],
    },
};

export default nextConfig;
