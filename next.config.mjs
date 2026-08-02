/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Sample data uses hosted stock photography. Add real business image
    // domains here once businesses start uploading their own photos.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
