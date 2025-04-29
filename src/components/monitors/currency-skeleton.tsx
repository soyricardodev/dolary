import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CurrencySkeleton() {
	// Create array of currency types to use for keys
	const skeletonItems = ["bcv", "paralelo", "promedio", "euro"];

	return (
		<div className="grid grid-cols-1 gap-3">
			{skeletonItems.map((item) => (
				<Card key={item} className="animate-pulse">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center">
							<div className="h-6 w-24 bg-muted rounded-md" />
							<div className="h-4 w-20 bg-muted rounded-md" />
						</div>
					</CardHeader>
					<CardContent className="pb-4">
						<div className="flex justify-between items-center">
							<div className="h-8 w-28 bg-muted rounded-md" />
							<div className="flex items-center gap-2">
								<div className="h-5 w-16 bg-muted rounded-md" />
								<div className="h-5 w-10 bg-muted rounded-md" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
