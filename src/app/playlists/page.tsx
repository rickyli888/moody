import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import PlaylistsContent from "./PlaylistsContent";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PlaylistsSkeleton } from "@/components/PlaylistsSkeleton";

export default async function PlaylistsPage() {
	const session = await getServerSession();

	if (!session) {
		redirect("/");
	}

	return (
		<div className="flex h-screen bg-background">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header user={session.user} />
				<Suspense fallback={<PlaylistsSkeleton />}>
					<PlaylistsContent />
				</Suspense>
			</div>
		</div>
	);
}
