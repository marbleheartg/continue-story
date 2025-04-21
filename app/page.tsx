"use client";

import sdk from "@farcaster/frame-sdk";
import { Poor_Story } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";

const poorStory = Poor_Story({
	weight: "400",
});

export default function Home() {
	const [text, setText] = useState(
		"One rainy afternoon, Emma found an old, rusty key while walking through the park. Curious, she looked around and noticed a small, hidden door at the base of a giant oak tree. The key fit perfectly." +
			" "
	);

	const [continuation, setContinuation] = useState("");

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		sdk.actions.ready({ disableNativeGestures: true });
	}, []);

	return (
		<>
			<Header />
			<main className="relative pt-6 text-black">
				<div className="absolute z-20">
					<Image
						src="/images/scroll.png"
						alt="scroll"
						width={400}
						height={539}
					/>
					<div
						className={`absolute top-28 left-8 text-2xl leading-9 -rotate-1 max-w-[325px] ${poorStory.className}`}
					>
						<span>{text} </span>
						<input
							value=""
							placeholder="_"
							onChange={e => setText(prev => prev + e.target.value)}
							onKeyDown={e => {
								if (e.key === "Backspace") {
									e.preventDefault();
									setText(prev => prev.slice(0, -1));
								}
							}}
							className="max-w-full w-5 focus:outline-none placeholder-black"
							// spellCheck={false}
							// autoCorrect="off"
							// autoCapitalize="off"
						/>
					</div>

					<div className="absolute bottom-5 right-3 cursor-pointer">
						<Image src="/images/like.png" alt="like" width={49} height={49} />
					</div>
				</div>
				<div className="absolute left-5 top-13 z-10 w-[350px] h-[450px] shadow-[0_0_15px_50px_rgba(0,0,0,0.3)]"></div>
			</main>
		</>
	);
}
