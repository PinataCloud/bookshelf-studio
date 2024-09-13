import { pinata } from "./pinata";
import { PGlite } from "@electric-sql/pglite";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const bookshelf = pgTable("bookshelf", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	author: text("author"),
	image_url: text("image_url"),
});

export async function restoreSnapshot(
	groupId: string,
): Promise<PGlite | undefined> {
	try {
		const files = await pinata.files.list().group(groupId).order("DESC");
		const dbFile = await pinata.gateways.get(files.files[0].cid);
		const file = dbFile.data as Blob;
		const client: PGlite = new PGlite({ loadDataDir: file });
		return client;
	} catch (error) {
		console.log(error);
		return;
	}
}

export async function createDb(name: string): Promise<string | unknown> {
	const db = new PGlite();
	try {
		const group = await pinata.groups.create({
			name: name,
			isPublic: true,
		});

		await db.exec(`
		    CREATE TABLE IF NOT EXISTS bookshelf (
		      id SERIAL PRIMARY KEY,
		      title TEXT,
		      author TEXT,
					image_url TEXT
		    );
		  `);

		const file = (await db.dumpDataDir("auto")) as File;
		const upload = await pinata.upload
			.file(file)
			.group(group.id)
			.addMetadata({ name: name });
		console.log(upload);
		return group.id;
	} catch (error) {
		console.log(error);
		return error;
	}
}
