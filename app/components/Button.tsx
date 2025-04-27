import getStory from "@/lib/getStory";
import postStory from "@/lib/postStory";
import { store } from "@/store";
import Image from "next/image";

const Button = () => {
	const { rules, scrollOpen, scrollVisible } = store();

	return (
		<div className="fixed bottom-13 left-0 right-0 w-full flex justify-center pointer-events-auto">
			<button
				className="flex justify-center w-11/12 py-2.5 bg-white rounded-3xl cursor-pointer"
				onClick={async () => {
					try {
						postStory();
						getStory();
					} catch (error) {
						console.log(error);
					}
				}}
				disabled={!scrollOpen || !scrollVisible}
			>
				{rules.enabled ? (
					<Image src="/images/arrow.png" alt="arrow" width={32} height={32} />
				) : !scrollOpen || !scrollVisible ? (
					<span>...</span>
				) : (
					<Image
						src="/images/feather.png"
						alt="feather"
						width={32}
						height={32}
					/>
				)}
			</button>
		</div>
	);
};

export default Button;
