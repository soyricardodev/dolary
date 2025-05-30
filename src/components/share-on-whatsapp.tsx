// WhatsAppShareButton.tsx
import type React from "react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { WhatsappIcon } from "./icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useTheme } from "next-themes";
import html2canvas from "html2canvas-pro";

interface ShareOnWhatsappProps {
	text: string;
}

export const ShareOnWhatsapp: React.FC<ShareOnWhatsappProps> = ({ text }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState<File | null>(null);
	const { theme } = useTheme();

	const captureAndShare = async () => {
		setIsLoading(true);

		try {
			// 1. Get the current page URL
			const pageUrl = window.location.href;

			// 2. Capture the screenshot using html2canvas
			const canvas = await html2canvas(document.body, {
				backgroundColor: theme === "dark" ? "#3a3636" : "#FEF2E8",
				scale: 2,
				allowTaint: true,
				foreignObjectRendering: true,
				removeContainer: true,
				logging: true,
			});

			// 3. Convert canvas to blob
			const blob = await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob((blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error("Failed to create blob from canvas"));
					}
				}, "image/png");
			});

			// 4. Create a File object from the Blob
			const file = new File([blob], `dolary-${theme}.png`, {
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
				onMouseDown={isLoading ? () => {} : captureAndShare}
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
					<Button onMouseDown={fallBackShare}>Compartir</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ShareOnWhatsapp;
