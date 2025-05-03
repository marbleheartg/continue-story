import { initScroll } from "@/lib/audio/scroll";
import { store, updateStore } from "@/store";
import { delay } from "@/utils/delay";
import sdk from "@farcaster/frame-sdk";
import { Spicy_Rice } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef } from "react";

const spicyRice = Spicy_Rice({
	subsets: ["latin", "latin-ext"],
	weight: "400",
});

const Header = () => {
	const { user, muted } = store();

	const scrollSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		initScroll(scrollSoundRef);
	}, []);

	return (
		<header>
			<button
				type="button"
				className="fixed top-13 left-5 flex items-center justify-center h-8.5 w-8.5 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer"
				onClick={async () => {
					try {
						if (!muted) scrollSoundRef?.current?.play().catch(console.warn);

						updateStore({ scrollOpen: false });

						updateStore(prev => ({
							rules: { ...prev.rules, enabled: !prev.rules.enabled },
						}));
					} catch (error) {
					} finally {
						await delay(2000);
						updateStore({ scrollOpen: true });
					}
				}}
			>
				<Image src="/images/info.png" alt="info" width={28} height={28} />
			</button>

			<h1
				className={`fixed top-13 left-0 right-0 flex flex-col items-center mx-auto text-center text-[var(--primary)] ${spicyRice.className} w-fit`}
			>
				<span className="text-3xl leading-[0.83] uppercase">Continue</span>
				<span className="translate-x-0.5">
					<span className="text-2xl pr-1 leading-[0.83] tracking-[2%]">
						the
					</span>
					<span className="text-3xl leading-[0.83] tracking-[7%] uppercase">
						story
					</span>
				</span>
			</h1>

			<button
				type="button"
				className="fixed top-13 right-5 h-9 w-9"
				onClick={async () => {
					const fid = store.getState().user?.fid;

					if (fid) await sdk.actions.viewProfile({ fid });
				}}
			>
				<Image
					className="rounded-full border-2 border-white"
					src={user?.pfpUrl || "/images/profile.png"}
					alt="profile"
					width={38}
					height={38}
				/>
			</button>
		</header>
	);
};

export default Header;
