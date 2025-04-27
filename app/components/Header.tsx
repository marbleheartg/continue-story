import { store, updateStore } from "@/store";
import { Spicy_Rice } from "next/font/google";
import Image from "next/image";

const spicyRice = Spicy_Rice({
	subsets: ["latin", "latin-ext"],
	weight: "400",
});

const Header = () => {
	const { user } = store();

	return (
		<header>
			<button
				type="button"
				className="fixed top-13 left-4 flex items-center justify-center h-8.5 w-8.5 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer"
				onClick={() => {
					updateStore(prev => ({
						rules: { enabled: !prev.rules.enabled, text: prev.rules.text },
					}));
				}}
			>
				<Image
					src="/images/info.png"
					alt="info"
					width={28}
					height={28}
					draggable="false"
				/>
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

			<button type="button" className="fixed top-13 right-4 h-9 w-9">
				<Image
					className="rounded-full border-2 border-white"
					src={user?.pfpUrl || "/images/profile.png"}
					alt="profile"
					width={38}
					height={38}
					draggable="false"
				/>
			</button>
		</header>
	);
};

export default Header;
