"use client";

import { Button } from "@/components/ui/button";

export function ShareButton({ id }: { id: string }) {
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			console.log("Text copied to clipboard");
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	const handleShare = () => {
		const shareUrl = `http://localhost:3000/shelf/${id}`;
		copyToClipboard(shareUrl);
	};

	return <Button onClick={handleShare}>Share</Button>;
}
