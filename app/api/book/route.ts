import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { drizzle } from "drizzle-orm/pglite";
import { restoreSnapshot, bookshelf } from "@/lib/db";

export async function POST(request: NextRequest) {
	const data = await request.json();
	try {
		const client = await restoreSnapshot(data.groupId);
		if (client) {
			const db = drizzle(client);
			await db.insert(bookshelf).values({
				title: data.title,
				author: data.author,
				image_url: data.image_url,
			});
			const newFile = (await client.dumpDataDir("auto")) as File;
			const upload = await pinata.upload.file(newFile).group(data.groupId);
			console.log(upload);

			return NextResponse.json({ id: upload.group_id }, { status: 200 });
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
