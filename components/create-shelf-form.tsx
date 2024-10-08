"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
	title: z.string().min(2).max(25),
});

export function CreateShelfForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const req = await fetch("/api/shelf", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: values.title,
				}),
			});
			const res = await req.json();
			router.push(`/shelf/${res.id}`);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			return error;
		}
	}
	return (
		<Dialog>
			<DialogTrigger>
				<Button asChild>
					<p> Create Shelf</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Classics" {...field} />
									</FormControl>
									<FormDescription>
										The name you want to give your bookshelf
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isLoading ? (
							<Button disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Creating your shelf...
							</Button>
						) : (
							<Button type="submit">Create</Button>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
