import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {source: '/', destination:'/home'},
      {source: '/cadastro', destination:'/auth/signup'},
      {source: '/login', destination:'/auth/login'},
      {source: '/dashboard', destination:'/main/dashboard'},
      {source: '/perfil', destination:'/main/profile'},
    ]
  }
};

export default nextConfig;
