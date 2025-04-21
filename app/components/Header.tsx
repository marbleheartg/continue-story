import { Spicy_Rice } from "next/font/google";
import Image from "next/image";

const spicyRice = Spicy_Rice({
	weight: "400",
});

const Header = () => {
	return (
		<header className="flex justify-between  pt-12">
			<div className="cursor-pointer">
				<Image src="/images/info.png" alt="info" width={38} height={38} />
			</div>

			<h1
				className={`flex flex-col text-[var(--primary)] leading-[0.89] pt-1 ${spicyRice.className}`}
			>
				<span className="text-[28px] uppercase">Continue</span>
				<span className="">
					<span className="text-[24px]  pr-1 ">the</span>
					<span className="text-[28px]  tracking-[7%] uppercase">story</span>
				</span>
			</h1>
			<div className="cursor-pointer">
				<Image src="/images/profile.png" alt="profile" width={38} height={38} />
			</div>
		</header>
	);
};

export default Header;
