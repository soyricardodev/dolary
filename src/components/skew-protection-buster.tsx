"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
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
			// Don't show toast when going offline
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
	const [isOnline, setIsOnline] = useState(true);
	const toastIdRef = useRef<string | number | null>(null);

	// Track online status
	useEffect(() => {
		setIsOnline(navigator.onLine);

		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => {
			setIsOnline(false);
			console.log("is offline");
			// Dismiss any active skew protection toast when going offline
			if (toastIdRef.current) {
				toast.dismiss(toastIdRef.current);
				toastIdRef.current = null;
			}
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	useEffect(() => {
		// Only show toast if we're online and the app is busted
		if (isOnline && isBusted) {
			// Dismiss any existing toast first
			if (toastIdRef.current) {
				toast.dismiss(toastIdRef.current);
			}

			// Show new toast and store its ID
			toastIdRef.current = toast("La app está desactualizada", {
				description: "Por favor refresca para tener la última versión",
				action: {
					label: "Refrescar ahora",
					onClick: () => window.location.reload(),
				},
				position: "bottom-center",
				dismissible: false,
				duration: Number.POSITIVE_INFINITY,
			});
		} else if (!isOnline && toastIdRef.current) {
			// Dismiss toast when going offline
			toast.dismiss(toastIdRef.current);
			toastIdRef.current = null;
		}
	}, [isBusted, isOnline]);

	return (
		<span className="sr-only">
			La app está desactualizada. Por favor refresca para tener la última
			versión. Refrescar ahora.
		</span>
	);
}
