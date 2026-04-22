export { default } from "next-auth/middleware";

export const config = {
  // 保护除 /auth/signin 以外的所有后台路径
  matcher: [
    "/",
    "/assets/:path*",
    "/content/:path*",
    "/observe/:path*",
    "/dashboard/:path*",
    "/review/:path*",
    "/optimize/:path*",
    "/settings/:path*",
  ],
};
