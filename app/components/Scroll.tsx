import { Poor_Story } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const poorStory = Poor_Story({
	weight: "400",
});

const Scroll = () => {
	const [text, setText] = useState(
		"One rainy afternoon, Emma found an old, rusty key while walking through the park." +
			" "
	);

	const [continuation, setContinuation] = useState("");

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const penSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		penSoundRef.current = new Audio("/sounds/pen.wav");
		penSoundRef.current.volume = 0.3;
	}, []);

	return (
		<div className="fixed top-35 left-4 right-4 flex justify-center">
			<div className="relative max-w-sm w-full">
				<Image
					src="/images/scroll.png"
					alt="scroll"
					width={400}
					height={539}
					className="relative z-10"
				/>

				<div
					className={`absolute z-10 top-28 left-9 max-w-10/12 text-2xl leading-9 -rotate-1 ${poorStory.className}`}
					onClick={() => inputRef.current?.focus()}
				>
					<span>
						{text} {continuation}
						{" _ ("}
						<span className="inline-block blink">
							{30 - continuation.length}
						</span>
						{")"}
					</span>
					<textarea
						ref={inputRef}
						value={continuation}
						onKeyDown={e => {
							if (
								e.key !== "Backspace" &&
								penSoundRef.current &&
								penSoundRef.current.paused
							) {
								penSoundRef.current.currentTime = 0;
								penSoundRef.current.play().catch(console.warn);
							}
						}}
						onChange={e => {
							if (e.target.value.length >= 31) return;
							setContinuation(e.target.value);
						}}
						className="max-w-full focus:outline-none placeholder-black opacity-0 w-0 h-0"
						spellCheck={false}
						autoCorrect="off"
						autoCapitalize="off"
					/>
				</div>

				<div></div>

				<Image
					className="absolute z-10 bottom-[4%] right-[3%] cursor-pointer"
					src="/images/like.png"
					alt="like"
					width={49}
					height={49}
				/>

				<div className="absolute inset-10 shadow-[0_0_20px_50px_rgba(0,0,0,0.3)]"></div>
			</div>
		</div>
	);
};

export default Scroll;
