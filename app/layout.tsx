import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Continue the story",
	description: "Continue the story",
};

const { DOMAIN } = process.env;

const frame = {
	version: "next",
	imageUrl: `https://${DOMAIN}/images/ogimage.png`,
	button: {
		title: "✍️",
		action: {
			type: "launch_frame",
			url: `https://${DOMAIN}`,
			name: "Continue the story",
			splashImageUrl: `https://${DOMAIN}/images/logo.png`,
			splashBackgroundColor: "#171020",
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
				<link rel="icon" href="/images/logo.png" type="image/png" />
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
