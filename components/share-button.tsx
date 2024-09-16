"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ShareButton({ id }: { id: string }) {
	const [copied, setCopied] = useState(false);

	const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

	async function handleCopy() {
		setCopied(true);
		await wait();
		setCopied(false);
	}

	async function copyToClipboard() {
		navigator.clipboard
			.writeText(`https://bookshelf.studio/shelf/${id}`)
			.then(async () => await handleCopy())
			.catch(() => alert("Failed to copy"));
	}

	return (
		<Button onClick={copyToClipboard} type="submit" className="flex gap-3">
			{copied ? "Copied!" : "Copy Link"}
		</Button>
	);
}
