import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col gap-12 items-center justify-start mt-12 min-h-screen mx-auto">
			<Skeleton className="h-8 w-64" />
			<div className="grid sm:grid-cols-4 grid-cols-2 gap-4 mt-12 flex-wrap mx-auto">
				{[...Array(8)].map((_, i) => (
					<div key={`skeleton-${_}`} className="p-4 max-w-48">
						<Skeleton className="h-[150px] w-[100px] mb-2" />
						<Skeleton className="h-4 w-32 mb-2" />
						<Skeleton className="h-3 w-full" />
					</div>
				))}
			</div>
		</div>
	);
}
