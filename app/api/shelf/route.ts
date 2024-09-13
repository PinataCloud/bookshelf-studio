import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createDb } from "@/lib/db";

export async function POST(request: NextRequest) {
	const data = await request.json();
	try {
		const groupId = await createDb(data.name);
		return NextResponse.json({ id: groupId }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
