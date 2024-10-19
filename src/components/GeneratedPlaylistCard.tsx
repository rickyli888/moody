import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
	name: string;
	artists: Array<{ name: string }>;
}

interface PlaylistCardProps {
	name: string;
	tracks: {
		total: number;
		items: Track[];
	};
	onRegenerate: () => void;
	spotifyUrl: string;
	isLoading: boolean;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
	name,
	tracks,
	onRegenerate,
	spotifyUrl,
	isLoading,
}) => {
	return (
		<AnimatePresence mode="wait">
			{isLoading ? (
				<motion.div
					key="skeleton"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}>
					<Card className="bg-card text-card-foreground">
						<CardHeader>
							<div className="h-8 bg-primary/10 rounded w-3/4 animate-pulse" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[...Array(5)].map((_, index) => (
									<div key={index} className="flex items-center gap-3">
										<div className="w-8 h-8 bg-primary/10 rounded-full animate-pulse" />
										<div className="flex-1">
											<div className="h-4 bg-primary/10 rounded w-3/4 animate-pulse" />
											<div className="h-3 bg-primary/10 rounded w-1/2 mt-2 animate-pulse" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			) : (
				<motion.div
					key="content"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}>
					<Card className="bg-card text-card-foreground">
						<CardHeader>
							<CardTitle className="text-2xl font-bold">{name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								Total Tracks: {tracks.total}
							</p>
							<h3 className="text-lg font-semibold mb-2">Sample Tracks:</h3>
							<ul className="space-y-2">
								{tracks.items.slice(0, 5).map((track, index) => (
									<motion.li
										key={index}
										className="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 hover:bg-primary/5"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}>
										<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
											{index + 1}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{track.name}</p>
											<p className="text-sm text-muted-foreground truncate">
												{track.artists.map((artist) => artist.name).join(", ")}
											</p>
										</div>
									</motion.li>
								))}
							</ul>
							<div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
								<Button
									onClick={onRegenerate}
									variant="outline"
									className="w-full sm:w-auto">
									Regenerate Playlist
								</Button>
								<Button asChild className="w-full sm:w-auto">
									<a
										href={spotifyUrl}
										target="_blank"
										rel="noopener noreferrer">
										Open in Spotify
									</a>
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default PlaylistCard;
