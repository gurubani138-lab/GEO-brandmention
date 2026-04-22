import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "商用账号登录",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        // 在商用版中，这里应该从数据库验证
        // 这里为了让你能立刻登录，设置一个演示账号
        if (credentials?.username === "admin" && credentials?.password === "geo123456") {
          return { id: "1", name: "系统管理员", role: "admin" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
});

export { handler as GET, handler as POST };
