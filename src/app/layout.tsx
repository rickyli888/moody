import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import AuthProvider from "@/lib/AuthProvider";

import "./globals.css";

export const metadata: Metadata = {
	title: "moody list",
	description: "generate a playlist based on your mood",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${GeistSans.variable} ${GeistMono.variable}`}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
