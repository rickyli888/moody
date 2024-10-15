import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { generatePlaylist, getSpotifyApi } from "../spotify";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { mood } = body;
		if (!mood) {
			return NextResponse.json(
				{ message: "Mood is required" },
				{ status: 400 }
			);
		}

		const accessToken = await getSpotifyApi(req);
		const userId = session.user?.id;

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID not found" },
				{ status: 400 }
			);
		}

		const playlist = await generatePlaylist(mood, accessToken, userId);
		return NextResponse.json(playlist);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
			return NextResponse.json(
				{ message: `Error generating playlist: ${error.message}` },
				{ status: 500 }
			);
		} else {
			console.error("An unknown error occurred:", error);
			return NextResponse.json(
				{ message: "An unknown error occurred while generating the playlist" },
				{ status: 500 }
			);
		}
	}
}
