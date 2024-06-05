import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        console.log({ credentials });
        return await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || "",
          (credentials as any).password || ""
        )
          .then((userCredential) => {
            if (userCredential.user) {
              return userCredential.user;
            }
            return null;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log({ errorCode, errorMessage });
          });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.uid = user.uid;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.uid = token.uid;
      session.user.email = token.email;
      return session;
    },
  },
};
export default NextAuth(authOptions);
