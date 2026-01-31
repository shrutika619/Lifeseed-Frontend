// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Your configuration options here
// };

// export default nextConfig;



// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Ye line add kar do (ya existing images object mein merge kar do)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Agar aap aur external images use kar rahe ho to yahan add kar sakte ho
    // domains: ['via.placeholder.com'], // purana method (deprecated)
  },
};

export default nextConfig;