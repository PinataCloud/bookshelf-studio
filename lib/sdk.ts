import { pinata } from "./pinata";

async function main() {
	const groups = await pinata.groups.list();
	console.log(groups);

	for await (const group of groups.groups) {
		const res = await pinata.groups.delete({
			groupId: group.id,
		});
		console.log(`Deleted group ${group.id}:`, res);
	}

	// const files = await pinata.files
	// 	.list()
	// 	.group("0191e6d5-4833-7667-9a13-f182955256e3");
	// console.log(files);
}

main();
