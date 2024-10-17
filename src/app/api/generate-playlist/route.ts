import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session || !session.accessToken) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const { mood } = await req.json();

	const expiresIn = session.expires
		? Math.floor((new Date(session.expires).getTime() - Date.now()) / 1000)
		: 3600;

	const spotify = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, {
		access_token: session.accessToken,
		token_type: "Bearer",
		expires_in: expiresIn,
		refresh_token: session.refreshToken || "",
	});

	try {
		// Get user's top tracks
		const topTracks = await spotify.currentUser.topItems(
			"tracks",
			"short_term",
			50
		);

		// Get audio features for all tracks
		const audioFeatures = await spotify.tracks.audioFeatures(
			topTracks.items.map((track) => track.id)
		);

		// Filter tracks based on mood and audio features
		const moodTracks = topTracks.items.filter((track, index) => {
			const features = audioFeatures[index];
			switch (mood.toLowerCase()) {
				case "happy":
					return features.energy > 0.7 && features.valence > 0.7;
				case "sad":
					return features.energy < 0.4 && features.valence < 0.4;
				case "energetic":
					return features.energy > 0.8;
				case "calm":
					return features.energy < 0.4 && features.instrumentalness > 0.5;
				case "focused":
					return (
						features.energy > 0.5 &&
						features.energy < 0.8 &&
						features.instrumentalness > 0.2
					);
				case "excited":
					return features.energy > 0.8 && features.valence > 0.6;
				case "relaxed":
					return features.energy < 0.5 && features.valence > 0.5;
				case "angry":
					return features.energy > 0.6 && features.valence < 0.4;
				case "romantic":
					return features.valence > 0.6 && features.acousticness > 0.4;
				case "nostalgic":
					return (
						features.valence > 0.4 &&
						features.valence < 0.7 &&
						features.acousticness > 0.5
					);
				default:
					return true;
			}
		});

		// Ensure we have at least 10 tracks, if not, add more from top tracks
		if (moodTracks.length < 10) {
			const remainingTracks = topTracks.items.filter(
				(track) => !moodTracks.includes(track)
			);
			moodTracks.push(...remainingTracks.slice(0, 10 - moodTracks.length));
		}

		// Create a new playlist
		const user = await spotify.currentUser.profile();
		const playlist = await spotify.playlists.createPlaylist(user.id, {
			name: `${mood} Mood Playlist`,
			description: `A playlist generated based on your ${mood} mood`,
			public: false,
		});

		// Add tracks to the playlist
		await spotify.playlists.addItemsToPlaylist(
			playlist.id,
			moodTracks.map((track) => track.uri)
		);

		return NextResponse.json(playlist);
	} catch (error) {
		console.error("Error generating playlist:", error);
		return NextResponse.json(
			{ error: "Failed to generate playlist" },
			{ status: 500 }
		);
	}
}
