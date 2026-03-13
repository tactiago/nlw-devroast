import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Dev Roast",
	description: "Dev Roast",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={jetbrainsMono.variable}>
				<nav className="flex h-14 w-full items-center justify-between border-b border-border-primary px-10">
					<Link href="/" className="flex items-center gap-2">
						<span className="font-mono text-xl font-bold text-accent-green">
							{">"}
						</span>
						<span className="font-mono text-lg font-medium text-text-primary">
							devroast
						</span>
					</Link>
					<Link
						href="/leaderboard"
						className="font-mono text-[13px] text-text-secondary transition-colors hover:text-text-primary"
					>
						leaderboard
					</Link>
				</nav>
				{children}
			</body>
		</html>
	);
}
