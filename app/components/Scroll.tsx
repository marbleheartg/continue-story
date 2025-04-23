import { store } from "@/store";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { Poor_Story } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef } from "react";

const poorStory = Poor_Story({
	weight: "400",
});

const Scroll = () => {
	const story = useStore(store, s => s.story);
	const continueText = useStore(store, s => s.continue);
	const rules = useStore(store, s => s.rules);
	const scrollOpen = useStore(store, s => s.scrollOpen);
	const scrollAnimationDone = useStore(store, s => s.scrollAnimationDone);

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const penSoundRef = useRef<HTMLAudioElement | null>(null);

	// store.setState(state => ({
	// 	...state,
	// 	story: "",
	// 	continue: "",
	// 	scrollOpen: !state.scrollOpen,
	// }))

	useEffect(() => {
		penSoundRef.current = new Audio("/sounds/pen.wav");
	}, []);

	return (
		<div className="fixed top-32 left-2 right-2 flex justify-center">
			<div
				className="relative max-w-[350px] w-full"
				onClick={() =>
					store.setState(state => ({
						...state,
						story: "",
						continue: "",
						scrollOpen: !state.scrollOpen,
						scrollAnimationDone: false,
					}))
				}
			>
				<div className="cursor-pointer relative w-full h-[539px]">
					<AnimatePresence mode="wait">
						{scrollOpen ? (
							<motion.div
								key="open"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.05 }}
								transition={{
									type: "spring",
									bounce: 0.3,
									duration: 0.1,
								}}
								onAnimationComplete={() => {
									store.setState(state => ({
										...state,
										scrollAnimationDone: true,
									}));
								}}
								className="absolute inset-0"
							>
								<Image
									src="/images/scroll.png"
									alt="Scroll Open"
									fill
									className=""
								/>
							</motion.div>
						) : (
							<motion.div
								key="closed"
								initial={{ opacity: 0, scale: 1.05 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{
									type: "spring",
									bounce: 0.3,
									duration: 0.1,
								}}
								className="absolute inset-0"
							>
								<Image
									src="/images/scrolled.png"
									alt="Scroll Closed"
									fill
									className="object-contain object-top"
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div
					className={`absolute z-10 top-28 left-9 max-w-10/12 text-2xl leading-9 -rotate-1 ${poorStory.className}`}
					onClick={() => inputRef.current?.focus()}
				>
					{scrollOpen &&
						scrollAnimationDone &&
						(rules.enabled ? (
							<span>{rules.text}</span>
						) : (
							<span>
								{story} {continueText}
								{" _ ("}
								<span className="inline-block blink">
									{30 - continueText.length}
								</span>
								{")"}
							</span>
						))}

					<textarea
						ref={inputRef}
						value={continueText}
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
							store.setState(state => ({
								...state,
								continue: e.target.value,
							}));
						}}
						className="max-w-full focus:outline-none placeholder-black opacity-0 w-0 h-0"
						spellCheck={false}
						autoCorrect="off"
						autoCapitalize="off"
					/>
				</div>

				<div></div>

				{!rules.enabled && scrollOpen && scrollAnimationDone && (
					<Image
						className="absolute z-10 bottom-[4%] right-[3%] cursor-pointer"
						src="/images/like.png"
						alt="like"
						width={49}
						height={49}
					/>
				)}

				{/* <div className="absolute inset-10 z-10 shadow-[0_0_20px_50px_rgba(0,0,0,0.3)]"></div> */}
			</div>
		</div>
	);
};

export default Scroll;
