import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const merriweather = Merriweather({
	weight: "700",
	variable: "--font-merriweather",
	subsets: ["latin"],
});
const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Bookshelf",
	description: "Create and share shelves of your favorite books",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
