import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID!,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
			authorization: {
				params: {
					scope:
						"user-read-email playlist-modify-private playlist-modify-public",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = account.providerAccountId;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.user.id = token.id;
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
