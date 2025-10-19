import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Корисничко име", type: "text" },
        password: { label: "Лозинка", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Проверка против база на податоци
        // За сега, hardcoded за тестирање
        if (credentials?.username === 'admin' && credentials?.password === 'admin') {
          return {
            id: '1',
            name: 'Администратор',
            email: 'admin@hram.mk'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

