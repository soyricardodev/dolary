// WhatsAppShareButton.tsx
import type React from "react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { WhatsappIcon } from "./icons";

interface ShareOnWhatsappProps {
	text: string;
}

export const ShareOnWhatsapp: React.FC<ShareOnWhatsappProps> = ({ text }) => {
	const [isLoading, setIsLoading] = useState(false);
	const captureAndShare = async () => {
		try {
			// 1. Get the current page URL
			const pageUrl = window.location.href;

			// 2. Construct the API endpoint URL
			const apiUrl = "/api/screenshot";

			setIsLoading(true);

			// 3. Fetch the screenshot from the API
			const response = await fetch(apiUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const blob = await response.blob();

			// 4. Create a File object from the Blob
			const file = new File([blob], "dolary.png", {
				type: "image/png",
			});

			// 5. Share using Web Share API
			if (
				navigator.share &&
				navigator.canShare &&
				navigator.canShare({ files: [file] })
			) {
				await navigator.share({
					title: "Check out this awesome content!",
					text: text,
					files: [file],
				});
			} else {
				// Fallback: WhatsApp URL scheme (text only)
				const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${pageUrl}`)}`;
				window.open(whatsappUrl, "_blank");
			}
		} catch (error) {
			console.error("Error capturing and sharing:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={captureAndShare}
			aria-label="Share on WhatsApp"
			size="icon"
			disabled={isLoading}
		>
			{isLoading ? (
				<span className="loader" aria-label="Loading...">
					<Loader2Icon className="size-4 animate-spin" />
				</span>
			) : (
				<WhatsappIcon className="!size-5" />
			)}
		</Button>
	);
};

export default ShareOnWhatsapp;
