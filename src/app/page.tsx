"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import MoodSelector from "@/components/MoodSelector";
import { motion, AnimatePresence } from "framer-motion";
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

interface Playlist {
	name: string;
	tracks: {
		total: number;
		items: Array<{ name: string; artists: Array<{ name: string }> }>;
	};
	external_urls: { spotify: string };
}

export default function Home() {
	const { data: session, status } = useSession();
	const [playlist, setPlaylist] = useState<Playlist | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const handleMoodSelect = async (moodInput: string) => {
		setLoading(true);
		try {
			const response = await fetch("/api/generate-playlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ mood: moodInput }),
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
			handleMoodSelect(playlist.name);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
			<Toaster />
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md mx-auto">
				<Card className="bg-white shadow-lg rounded-lg overflow-hidden">
					<CardHeader className="bg-gradient-to-r from-blue-400 to-purple-500 p-6 text-white">
						<CardTitle className="text-3xl font-extrabold">
							Moody Playlist
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						{status === "loading" && (
							<p className="text-gray-500">Loading...</p>
						)}
						{!session && status !== "loading" && (
							<div className="text-center">
								<p className="mb-4 text-gray-600">
									Sign in to create mood-based playlists:
								</p>
								<Button
									onClick={() => signIn("spotify")}
									className="w-full bg-green-500 hover:bg-green-600 text-white transition duration-300">
									Sign in with Spotify
								</Button>
							</div>
						)}
						{session && (
							<div className="space-y-6">
								<p className="text-lg font-semibold text-gray-800">
									Welcome, {session.user?.name}!
								</p>
								<MoodSelector onMoodSelect={handleMoodSelect} />
								<AnimatePresence>
									{loading && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="flex items-center justify-center py-4">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
										</motion.div>
									)}
								</AnimatePresence>
								<AnimatePresence>
									{playlist && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.5 }}>
											<Card className="bg-gray-50">
												<CardHeader>
													<CardTitle className="text-xl font-bold text-gray-800">
														{playlist.name}
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className="text-gray-600">
														Total Tracks: {playlist.tracks?.total}
													</p>
													<p className="mt-2 font-semibold text-gray-700">
														Sample Tracks:
													</p>
													<ul className="list-disc pl-5 text-gray-600">
														{playlist.tracks.items
															.slice(0, 5)
															.map((track, index) => (
																<li key={index}>
																	{track.name} -{" "}
																	{track.artists
																		.map((artist) => artist.name)
																		.join(", ")}
																</li>
															))}
													</ul>
												</CardContent>
												<CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
													<Button
														onClick={handleRegeneratePlaylist}
														className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white transition duration-300">
														Regenerate Playlist
													</Button>
													<Button
														asChild
														className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white transition duration-300">
														<a
															href={playlist.external_urls?.spotify}
															target="_blank"
															rel="noopener noreferrer">
															Open in Spotify
														</a>
													</Button>
												</CardFooter>
											</Card>
										</motion.div>
									)}
								</AnimatePresence>
								<Button
									onClick={() => signOut()}
									className="w-full bg-red-500 hover:bg-red-600 text-white transition duration-300">
									Sign out
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
