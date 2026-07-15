import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "three",
    "@react-three/postprocessing",
    "postprocessing",
    "@react-three/cannon",
    "cannon-es",
  ],
};

export default nextConfig;
