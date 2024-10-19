import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlaylistsSkeleton() {
	return (
		<main className="p-6">
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<Card key={index} className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<Skeleton className="h-4 w-2/3" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-48 w-full mb-4" />
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-10 w-full mt-4" />
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
