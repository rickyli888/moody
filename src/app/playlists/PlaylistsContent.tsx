export default function PlaylistsContent() {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		fetchPlaylists();
	}, []);

	const fetchPlaylists = async () => {
		try {
			const response = await fetch("/api/playlists");
			if (!response.ok) {
				throw new Error("Failed to fetch playlists");
			}
			const data = await response.json();
			setPlaylists(data);
		} catch (error) {
			console.error("Error fetching playlists:", error);
			toast({
				title: "Error",
				description: "Failed to load playlists. Please try again later.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <PlaylistsSkeleton />;
	}

	return (
		<ScrollArea className="flex-1">
			<main className="p-6">
				<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{playlists.map((playlist) => (
						<PlaylistCard
							key={playlist.id}
							playlist={playlist}
							onRegenerate={() => {
								/* Add regenerate function here if needed */
							}}
						/>
					))}
				</div>
			</main>
		</ScrollArea>
	);
}
