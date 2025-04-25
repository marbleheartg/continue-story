import { domain } from "@/config";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Continue the story",
	description: "Continue the story",
};

const frame = {
	version: "next",
	imageUrl: `https://${domain}/images/frame/ogimage.png`,
	button: {
		title: "✍️",
		action: {
			type: "launch_frame",
			url: `https://${domain}`,
			name: "Continue the story",
			splashImageUrl: `https://${domain}/images/frame/logo.png`,
			splashBackgroundColor: "#a67443",
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="fc:frame" content={JSON.stringify(frame)} />
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
