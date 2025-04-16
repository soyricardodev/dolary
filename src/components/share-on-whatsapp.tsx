// WhatsAppShareButton.tsx
import type React from "react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { WhatsappIcon } from "./icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ShareOnWhatsappProps {
	text: string;
}

export const ShareOnWhatsapp: React.FC<ShareOnWhatsappProps> = ({ text }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState<File | null>(null);

	const captureAndShare = async () => {
		setIsLoading(true);

		try {
			// 1. Get the current page URL
			const pageUrl = window.location.href;

			// 2. Construct the API endpoint URL
			const apiUrl = "/api/screenshot";

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
				try {
					await navigator.share({
						title: "Mira las tasas del Dólar!",
						text: text,
						files: [file],
					});
				} catch (error) {
					setImage(file);
					setIsOpen(true);
				}
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

	async function fallBackShare() {
		if (image) {
			if (
				navigator.share &&
				navigator.canShare &&
				navigator.canShare({ files: [image] })
			) {
				await navigator.share({
					title: "Mira las tasa del Dólar!",
					text: text,
					files: [image],
				});
			}
		}
	}

	return (
		<>
			<Button
				onClick={isLoading ? () => {} : captureAndShare}
				aria-label="Share on WhatsApp"
				size="icon"
				className="size-9 p-0 [&_svg]:size-5 hover:translate-x-[4px]! hover:translate-y-[4px]! hover:shadow-none bg-secondary-background"
			>
				{isLoading ? (
					<span className="loader" aria-label="Loading...">
						<Loader2Icon className="size-5 animate-spin stroke-foreground" />
					</span>
				) : (
					<WhatsappIcon className="stroke-foreground fill-foreground" />
				)}
			</Button>
			<Dialog open={isOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Haz Click para compartir</DialogTitle>
					</DialogHeader>
					<Button onClick={fallBackShare}>Compartir</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ShareOnWhatsapp;
