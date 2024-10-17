import NextAuth, { NextAuthOptions, Session } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			authorization: {
				params: {
					redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
					scope: "user-read-email playlist-modify-public user-top-read",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.expiresAt = account.expires_at;
			}
			return token;
		},
		async session({ session, token }) {
			(session as Session & { accessToken: string }).accessToken =
				token.accessToken as string;
			(session as Session & { refreshToken: string }).refreshToken =
				token.refreshToken as string;
			(session as Session & { expiresAt: number }).expiresAt =
				token.expiresAt as number;
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
