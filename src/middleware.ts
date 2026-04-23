export { default } from "next-auth/middleware";

export const config = {
  // 仅保护后台路径，允许访问公开首页 (/) 和 登录页 (/auth/signin)
  matcher: [
    "/console/:path*",
    "/assets/:path*",
    "/content/:path*",
    "/observe/:path*",
    "/dashboard/:path*",
    "/review/:path*",
    "/optimize/:path*",
    "/settings/:path*",
  ],
};
