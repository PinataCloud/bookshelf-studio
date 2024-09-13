"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Book {
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		description?: string;
		publishedDate?: string;
		imageLinks?: {
			thumbnail?: string;
		};
	};
}

export function AddBook({ groupId }: { groupId: string }) {
	const [query, setQuery] = useState("");
	const [books, setBooks] = useState<Book[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingBook, setLoadingBook] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchBooks = async () => {
			if (query.trim() === "") {
				setBooks([]);
				return;
			}

			setLoading(true);
			try {
				const response = await fetch(
					`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
						query,
					)}&maxResults=5`,
				);
				const data = await response.json();
				setBooks(data.items || []);
			} catch (error) {
				console.error("Error fetching books:", error);
				setBooks([]);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimer = setTimeout(fetchBooks, 300);

		return () => clearTimeout(debounceTimer);
	}, [query]);

	async function addBook(book: Book) {
		setLoadingBook(true);
		try {
			const data = JSON.stringify({
				title: book.volumeInfo.title,
				author: book.volumeInfo.authors?.[0],
				image_url: book.volumeInfo.imageLinks?.thumbnail,
				groupId: groupId,
			});

			const req = await fetch("/api/book", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: data,
			});
			const res = await req.json();
			console.log(res);
			setOpen(false);
			setQuery("");
			setLoadingBook(false);
			router.refresh();
		} catch (error) {
			setLoadingBook(false);
			console.log(error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button asChild>
					<p>Add Book</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<div className="relative">
					<Input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search for books..."
						className="w-full p-2 my-4"
					/>
					{loading && (
						<div className="absolute w-full bg-white border rounded mt-1 p-2 shadow-lg">
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						</div>
					)}
					{!loading && !loadingBook && books.length > 0 && (
						<ul className="absolute w-full bg-white border rounded mt-1 shadow-lg max-h-60 overflow-y-auto">
							{books.map((book) => (
								<li
									key={book.id}
									className="p-2 hover:bg-gray-100 cursor-pointer"
									onClick={() => addBook(book)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											addBook(book);
										}
									}}
								>
									{book.volumeInfo.title}
								</li>
							))}
						</ul>
					)}
					{loadingBook && (
						<div className="flex flex-row items-center">
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							<p>Adding...</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
