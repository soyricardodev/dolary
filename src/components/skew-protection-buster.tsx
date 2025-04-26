"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

function useSkewProtectionBusted() {
	const { data, error, isFetching } = useQuery({
		queryKey: ["skew-protection-buster_NO_STORE"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/version?dpl=LATEST");
				if (!res.ok) {
					throw new Error(`Failed to fetch version: ${res.status}`);
				}
				return res.json() as Promise<{
					version: string | null;
					commit_sha: string | null;
				}>;
			} catch (err) {
				console.error("Error fetching version:", err);
				throw err;
			}
		},
		staleTime: 0,
		gcTime: 0,
		refetchInterval: 30_000,
		retry: 3,
	});

	// If we're loading or have an error, don't show outdated warning
	if (isFetching || error || !data) return false;

	// Compare versions to determine if app is outdated
	return data.version !== process.env.NEXT_PUBLIC_BUILD_ID;
}

export function SkewProtectionBuster() {
	const isBusted = useSkewProtectionBusted();

	console.log(isBusted);

	useEffect(() => {
		if (isBusted) {
			toast("La app está desactualizada", {
				description: "Por favor refresca para tener la última versión",
				action: {
					label: "Refrescar ahora",
					onClick: () => window.location.reload(),
				},
				position: "bottom-center",
				dismissible: false,
				duration: Number.POSITIVE_INFINITY,
			});
		}
	}, [isBusted]);

	return (
		<span className="sr-only">
			La app está desactualizada. Por favor refresca para tener la última
			versión. Refrescar ahora.
		</span>
	);
}
