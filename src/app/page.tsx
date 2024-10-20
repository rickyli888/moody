"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import Link from "next/link";

import MoodSelector from "@/components/MoodSelector";
import PlaylistCard from "@/components/GeneratedPlaylistCard";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import styles from "@/styles/sign_in.module.css";

interface Playlist {
	name: string;
	tracks: {
		total: number;
		items: Array<{ name: string; artists: Array<{ name: string }> }>;
	};
	external_urls: { spotify: string };
}

export default function Home() {
	const { data: session } = useSession();
	const [playlist, setPlaylist] = useState<Playlist | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const handleMoodSelect = async (moodInput: string, genres: string[]) => {
		setLoading(true);
		try {
			const response = await fetch("/api/generate-playlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ mood: moodInput, genres }),
			});
			if (!response.ok) {
				throw new Error("Failed to generate playlist");
			}
			const data: Playlist = await response.json();
			setPlaylist(data);
			toast({
				title: "Success",
				description: "Playlist generated successfully!",
			});
		} catch (err) {
			console.error(err);
			toast({
				title: "Error",
				description: "Error generating playlist. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRegeneratePlaylist = () => {
		if (playlist) {
			handleMoodSelect(playlist.name, []);
		}
	};

	if (!session) {
		return (
			<div className="flex flex-col h-screen bg-background">
				<div className="flex items-center space-x-2 px-12 py-12">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={`h-10 w-10 ${styles.animatedGradientSvg}`}>
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
					<h2 className={`${styles.animatedGradientText} text-3xl font-bold`}>
						moody
					</h2>
				</div>
				<div className="absolute inset-0 flex justify-center items-center">
					<Card className="w-[600px] p-20">
						<CardHeader>
							<CardTitle className="text-4xl text-center">
								welcome to{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-jungleGreen via-pear to-blue-300 hover:scale-105 hover:text-primary transition-colors duration-200">
									moody
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-center text-lg text-muted-foreground font-medium">
								Sign in with and make some playlists
							</p>
						</CardContent>
						<CardFooter>
							<Button
								onClick={() => signIn("spotify")}
								className="w-full text-lg py-6 font-medium">
								Sign in with Spotify
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background">
			<Toaster />
			{/* Sidebar */}
			<div className="hidden w-64 flex-col bg-muted p-4 md:flex">
				<div className="flex items-center space-x-2 mb-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-6 w-6 text-background">
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
					<h2 className="text-lg font-semibold text-background">moody</h2>
				</div>
				<nav className="space-y-2">
					<Button
						variant="ghost"
						className="w-full justify-start text-background">
						Dashboard
					</Button>
					<Link href="/playlists">
						<Button
							variant="ghost"
							className="w-full justify-start text-background">
							Playlists
						</Button>
					</Link>
					<Button
						variant="ghost"
						className="w-full justify-start text-background">
						Settings
					</Button>
				</nav>
			</div>

			{/* Main content */}
			<div className="flex-1 overflow-auto">
				{/* Header */}
				<header className="flex items-center justify-between border-b p-4">
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<div className="flex items-center space-x-4">
						<span className="font-semibold">{session.user?.name}</span>
						<Avatar>
							<AvatarImage src={session.user?.image || undefined} />
							<AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
						</Avatar>
						<Button onClick={() => signOut()}>Sign out</Button>
					</div>
				</header>

				{/* Content */}
				<main className="p-6">
					<MoodSelector onMoodSelect={handleMoodSelect} />

					<AnimatePresence>
						{(loading || playlist) && (
							<PlaylistCard
								name={playlist?.name || ""}
								tracks={playlist?.tracks || { total: 0, items: [] }}
								onRegenerate={handleRegeneratePlaylist}
								spotifyUrl={playlist?.external_urls.spotify || ""}
								isLoading={loading}
							/>
						)}
					</AnimatePresence>
				</main>
			</div>
		</div>
	);
}
