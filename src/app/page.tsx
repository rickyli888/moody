"use client";

import { useState } from "react";
// import { useSession, signIn, signOut } from 'next-auth/react';
import MoodSelector from "@/components/MoodSelector";

const mockSession = {
	user: { name: "Mock User" },
};

interface Playlist {
	name: string;
	tracks: { total: number };
	external_urls: { spotify: string };
}

export default function Home() {
	// const { data: session } = useSession();
	const session = mockSession;
	const [playlist, setPlaylist] = useState<Playlist | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleMoodSelect = async (mood: string) => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/generate-playlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ mood }),
			});
			if (!response.ok) {
				throw new Error("Failed to generate playlist");
			}
			const data: Playlist = await response.json();
			setPlaylist(data);
		} catch (err) {
			setError("Error generating playlist. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
			<div className="relative py-3 sm:max-w-xl sm:mx-auto">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
				<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
					<div className="max-w-md mx-auto">
						<div className="divide-y divide-gray-200">
							<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
								<h2 className="text-3xl font-extrabold text-gray-900">
									Moody Playlist
								</h2>
								{!session && (
									<>
										<p>Sign in to create mood-based playlists:</p>
										<button
											onClick={() => {}}
											className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
											Sign in with Spotify
										</button>
									</>
								)}
								{session && (
									<>
										<p>Welcome, {session.user?.name}!</p>
										<MoodSelector onMoodSelect={handleMoodSelect} />
										{loading && <p>Generating playlist...</p>}
										{error && <p className="text-red-500">{error}</p>}
										{playlist && (
											<div>
												<h3 className="text-xl font-bold">Your Playlist:</h3>
												<p>Name: {playlist.name}</p>
												<p>Tracks: {playlist.tracks?.total}</p>
												<a
													href={playlist.external_urls?.spotify}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500 hover:underline">
													Open in Spotify
												</a>
											</div>
										)}
										<button
											onClick={() => {}}
											className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
											Sign out
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
