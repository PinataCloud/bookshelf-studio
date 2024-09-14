export const revalidate = 0;

import { pinata } from "@/lib/pinata";
import type { GroupResponseItem } from "pinata";
import { CreateShelfForm } from "@/components/create-shelf-form";
import { Suspense } from "react";
import Link from "next/link";
import Loading from "./shelf/[group_id]/loading";

async function fetchData() {
	try {
		const groups = await pinata.groups.list();
		console.log(groups);
		if (groups.groups === null) {
			return [];
		}
		return groups.groups;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export default async function Home() {
	const groups = await fetchData();
	return (
		<div className="min-h-screen mx-auto">
			<div className="flex flex-col gap-12 mt-12 items-center justify-start mx-auto font-[family-name:var(--font-geist-sans)] border-4 border-black rounded-md max-w-[500px] py-12">
				<div className="flex flex-col justify-center items-center">
					<h1 className="font-[family-name:var(--font-merriweather)] scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
						Bookshelf
					</h1>
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Create and share your favorite books
					</h3>
				</div>
				<div className="flex flex-col gap-4 mt-12">
					{groups.length === 0 && <h1>No Shelves yet!</h1>}
					{groups.map((group: GroupResponseItem) => (
						<Suspense key={group.id} fallback={<Loading />}>
							<Link href={`/shelf/${group.id}`}>
								<div className="p-4 w-full rounded-lg hover:text-gray-500 transition-colors">
									<h1 className="text-2xl font-semibold underline underline-offset-[12px]">
										{group.name}
									</h1>
								</div>
							</Link>
						</Suspense>
					))}
				</div>
				<CreateShelfForm />
			</div>
		</div>
	);
}
