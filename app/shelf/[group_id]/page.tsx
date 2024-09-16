export const revalidate = 0;

import { pinata } from "@/lib/pinata";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import Link from "next/link";
import Image from "next/image";
import { AddBook } from "@/components/add-book-search";
import { Button } from "@/components/ui/button";
import { restoreSnapshot, bookshelf } from "@/lib/db";
import { ShareButton } from "@/components/share-button";

type Book = {
	id: number;
	title: string;
	author: string | null;
	image_url: string | null;
};

async function fetchData(group_id: string): Promise<Book[]> {
	try {
		const client = await restoreSnapshot(group_id);
		if (client) {
			const db = drizzle(client);
			const books: Book[] = await db.select().from(bookshelf);
			console.log(books);
			return books;
		}
		return [];
	} catch (error) {
		console.log(error);
		return [];
	}
}
export default async function Page({
	params,
}: { params: { group_id: string } }) {
	const books = await fetchData(params.group_id);
	const { name } = await pinata.groups.get({ groupId: params.group_id });
	console.log(books);

	return (
		<div className="min-h-screen mx-auto">
			<div className="flex flex-col mx-auto gap-12 items-center justify-start border-4 border-black mt-12 sm:max-w-screen-lg max-w-[375px] p-4 font-[family-name:var(--font-geist-sans)]">
				<h2 className="scroll-m-20 font-[family-name:var(--font-merriweather)] text-4xl font-semibold tracking-tight mt-2 underline">
					{name}
				</h2>
				<div className="flex gap-4">
					<Button asChild>
						<Link href="/">Go Back</Link>
					</Button>
					<AddBook groupId={params.group_id} />
					<ShareButton id={params.group_id} />
				</div>
				{books.length === 0 && (
					<h3 className="text-center">No books yet, add one now!</h3>
				)}
				<div className="grid sm:grid-cols-4 grid-cols-2 gap-4 mt-12 flex-wrap mx-auto">
					{books.map((book: Book) => (
						<div className="p-4 max-w-48" key={book.id}>
							<Image
								alt={book.title}
								src={book.image_url || ""}
								width={150}
								height={100}
							/>
							<h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
								{book.title}
							</h4>
							<p className="truncate">{book.author}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
