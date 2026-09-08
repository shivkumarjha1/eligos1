/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: fontMode(),
};

function fontMode() {
  return true;
}

export default nextConfig;
