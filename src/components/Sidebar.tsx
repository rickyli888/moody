import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Sidebar() {
	return (
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
				<Link href="/">
					<Button
						variant="ghost"
						className="w-full justify-start text-background">
						Dashboard
					</Button>
				</Link>
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
	);
}
