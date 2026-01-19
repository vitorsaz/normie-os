/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: 'pump.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cf-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
    ],
    unoptimized: true,
  },
}
module.exports = nextConfig
