"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function useSkewProtectionBusted() {
	// Track online status
	const [isOnline, setIsOnline] = useState(true); // Assume online initially

	useEffect(() => {
		// Set initial status based on navigator
		setIsOnline(navigator.onLine);

		const handleOnline = () => {
			setIsOnline(true);
			// Notify user they're back online
			toast.success("Conexión restaurada", {
				description: "Tu conexión a internet ha sido restaurada",
				position: "bottom-center",
				duration: 3000,
			});
		};

		const handleOffline = () => {
			setIsOnline(false);
			// Notify user they're offline
			toast.error("Sin conexión", {
				description: "No hay conexión a internet",
				position: "bottom-center",
				duration: Number.POSITIVE_INFINITY, // Keep showing until back online
				dismissible: true,
			});
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Cleanup listeners on component unmount
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

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
		enabled: isOnline, // Only run the query when online
	});

	// If offline, explicitly return false to prevent outdated warnings
	if (!isOnline) return false;

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
