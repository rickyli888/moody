import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export async function getSpotifyApi(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	if (!token) {
		throw new Error("User not authenticated");
	}
	return token.accessToken as string;
}

export async function getAudioFeatures(trackId: string, accessToken: string) {
	const response = await fetch(
		`${SPOTIFY_API_BASE}/audio-features/${trackId}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Failed to fetch audio features: ${response.statusText}`);
	}
	return response.json();
}

export async function searchTracks(query: string, accessToken: string) {
	const response = await fetch(
		`${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(
			query
		)}&type=track&limit=50`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	if (!response.ok) {
		throw new Error(`Failed to search tracks: ${response.statusText}`);
	}
	return response.json();
}

export async function createPlaylist(
	userId: string,
	name: string,
	description: string,
	accessToken: string
) {
	const response = await fetch(
		`${SPOTIFY_API_BASE}/users/${userId}/playlists`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, description, public: false }),
		}
	);
	if (!response.ok) {
		throw new Error(`Failed to create playlist: ${response.statusText}`);
	}
	return response.json();
}

export async function addTracksToPlaylist(
	playlistId: string,
	trackUris: string[],
	accessToken: string
) {
	const response = await fetch(
		`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ uris: trackUris }),
		}
	);
	if (!response.ok) {
		throw new Error(`Failed to add tracks to playlist: ${response.statusText}`);
	}
	return response.json();
}

export interface Mood {
	name: string;
	minEnergy: number;
	maxEnergy: number;
	minValence: number;
	maxValence: number;
	minDanceability: number;
	maxDanceability: number;
}

export const moodMap: Record<string, Mood> = {
	happy: {
		name: "Happy",
		minEnergy: 0.6,
		maxEnergy: 1.0,
		minValence: 0.7,
		maxValence: 1.0,
		minDanceability: 0.5,
		maxDanceability: 1.0,
	},
	sad: {
		name: "Sad",
		minEnergy: 0.0,
		maxEnergy: 0.4,
		minValence: 0.0,
		maxValence: 0.3,
		minDanceability: 0.0,
		maxDanceability: 0.5,
	},
	energetic: {
		name: "Energetic",
		minEnergy: 0.8,
		maxEnergy: 1.0,
		minValence: 0.5,
		maxValence: 1.0,
		minDanceability: 0.7,
		maxDanceability: 1.0,
	},
	calm: {
		name: "Calm",
		minEnergy: 0.0,
		maxEnergy: 0.4,
		minValence: 0.3,
		maxValence: 0.7,
		minDanceability: 0.0,
		maxDanceability: 0.5,
	},
	focused: {
		name: "Focused",
		minEnergy: 0.4,
		maxEnergy: 0.7,
		minValence: 0.3,
		maxValence: 0.7,
		minDanceability: 0.2,
		maxDanceability: 0.6,
	},
};

export async function generatePlaylist(
	mood: string,
	accessToken: string,
	userId: string
) {
	const moodParams = moodMap[mood.toLowerCase()];
	if (!moodParams) {
		throw new Error("Invalid mood");
	}

	const searchResults = await searchTracks(moodParams.name, accessToken);
	const tracks = searchResults.tracks.items;

	const filteredTracks = await Promise.all(
		tracks.map(async (track: any) => {
			const features = await getAudioFeatures(track.id, accessToken);
			return { track, features };
		})
	);

	const matchingTracks = filteredTracks.filter(
		({ features }) =>
			features.energy >= moodParams.minEnergy &&
			features.energy <= moodParams.maxEnergy &&
			features.valence >= moodParams.minValence &&
			features.valence <= moodParams.maxValence &&
			features.danceability >= moodParams.minDanceability &&
			features.danceability <= moodParams.maxDanceability
	);

	const playlist = await createPlaylist(
		userId,
		`${moodParams.name} Mood Playlist`,
		`A playlist for your ${moodParams.name.toLowerCase()} mood`,
		accessToken
	);

	const trackUris = matchingTracks.slice(0, 20).map(({ track }) => track.uri);
	await addTracksToPlaylist(playlist.id, trackUris, accessToken);

	return playlist;
}
