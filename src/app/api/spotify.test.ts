import {
	getSpotifyApi,
	getAudioFeatures,
	searchTracks,
	createPlaylist,
	addTracksToPlaylist,
	generatePlaylist,
} from "./spotify";
import { NextRequest } from "next/server";

// Mock fetch
global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
	})
) as jest.Mock;

describe("Spotify API functions", () => {
	const mockAccessToken = "mockAccessToken";
	const mockTrackId = "mockTrackId";
	const mockUserId = "mockUserId";
	const mockMood = "happy";

	test("getSpotifyApi should throw error if no token", async () => {
		const req = {} as NextRequest;
		await expect(getSpotifyApi(req)).rejects.toThrow("User not authenticated");
	});

	test("getAudioFeatures should fetch audio features", async () => {
		await getAudioFeatures(mockTrackId, mockAccessToken);
		expect(fetch).toHaveBeenCalledWith(
			`https://api.spotify.com/v1/audio-features/${mockTrackId}`,
			{
				headers: { Authorization: `Bearer ${mockAccessToken}` },
			}
		);
	});

	test("searchTracks should search for tracks", async () => {
		await searchTracks("test", mockAccessToken);
		expect(fetch).toHaveBeenCalledWith(
			`https://api.spotify.com/v1/search?q=test&type=track&limit=50`,
			{
				headers: { Authorization: `Bearer ${mockAccessToken}` },
			}
		);
	});

	test("createPlaylist should create a playlist", async () => {
		await createPlaylist(
			mockUserId,
			"Test Playlist",
			"Description",
			mockAccessToken
		);
		expect(fetch).toHaveBeenCalledWith(
			`https://api.spotify.com/v1/users/${mockUserId}/playlists`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${mockAccessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "Test Playlist",
					description: "Description",
					public: false,
				}),
			}
		);
	});

	test("addTracksToPlaylist should add tracks to a playlist", async () => {
		await addTracksToPlaylist(
			"mockPlaylistId",
			["trackUri1", "trackUri2"],
			mockAccessToken
		);
		expect(fetch).toHaveBeenCalledWith(
			`https://api.spotify.com/v1/playlists/mockPlaylistId/tracks`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${mockAccessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ uris: ["trackUri1", "trackUri2"] }),
			}
		);
	});

	test("generatePlaylist should generate a playlist based on mood", async () => {
		await generatePlaylist(mockMood, mockAccessToken, mockUserId);
		expect(fetch).toHaveBeenCalled();
	});
});
