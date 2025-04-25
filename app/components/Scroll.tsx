import { store, updateStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { Poor_Story } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef } from "react";

const poorStory = Poor_Story({
	weight: "400",
});

const Scroll = () => {
	const { story, rules, newStoryPart, scrollOpen, scrollVisible } = store();

	const inputRef = useRef<HTMLTextAreaElement>(null);
	// const penSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		async function init() {
			const res = await fetch("/api/story");

			const { randStory } = await res.json();

			updateStore({ story: randStory });
		}

		init();

		// penSoundRef.current = new Audio("/sounds/pen.wav");
	}, []);

	return (
		<div
			className="fixed top-30 left-2 right-2 flex justify-center"
			onClick={() => {
				updateStore(prev => ({ scrollOpen: !prev.scrollOpen }));
			}}
		>
			<div className="relative max-w-[360px] w-full">
				<div className="cursor-pointer relative w-full h-[450px]">
					<AnimatePresence mode="wait">
						{scrollOpen ? (
							<motion.div
								key="open"
								initial={{ opacity: 1, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 1, y: 5 }}
								transition={{
									type: "spring",
									bounce: 0.75,
									duration: 0.5,
								}}
								onAnimationComplete={() => {
									updateStore({
										scrollVisible: true,
									});
								}}
								className="absolute inset-0"
							>
								<Image
									src="/images/scroll.png"
									alt="Scroll Open"
									fill
									draggable="false"
								/>

								<div
									className={`absolute z-10 top-25 left-9 max-w-9/12 text-2xl leading-9 -rotate-1 ${poorStory.className} overflow-hidden`}
									onClick={() => inputRef.current?.focus()}
								>
									{story?.parts &&
										scrollOpen &&
										scrollVisible &&
										(rules.enabled ? (
											<span>{rules.text}</span>
										) : (
											<span>
												{story?.parts.map(part => part.text).join("")}{" "}
												{newStoryPart?.text}
												{" _ "}
												<span
													className={`inline-block blink ${
														newStoryPart.text.length < 15
															? "text-red-900"
															: "text-green-900"
													}`}
												>
													{30 - newStoryPart.text.length}
												</span>
											</span>
										))}

									<textarea
										ref={inputRef}
										value={newStoryPart?.text}
										onKeyDown={e => {
											if (
												e.key !== "Backspace"
												//  &&
												// penSoundRef.current &&
												// penSoundRef.current.paused
											) {
												// penSoundRef.current.currentTime = 0;
												// penSoundRef.current.play().catch(console.warn);
											}
										}}
										onChange={e => {
											const v = e.target.value;
											const l = v.length;

											if (l >= 31 || v.endsWith("  ")) return;

											updateStore({
												newStoryPart: {
													text: v,
												},
											});
										}}
										className="max-w-full focus:outline-none placeholder-black opacity-0 w-0 h-0"
										spellCheck={false}
										autoCorrect="off"
										autoCapitalize="off"
									/>
								</div>

								{!rules.enabled && scrollOpen && scrollVisible && (
									<Image
										className="absolute z-10 bottom-[3%] right-[3%] cursor-pointer"
										src="/images/like.png"
										alt="like"
										width={49}
										height={49}
										draggable="false"
									/>
								)}
								{scrollOpen && scrollVisible && (
									<div className="absolute inset-10 -z-10 shadow-[0_0_25px_60px_rgba(0,0,0,0.3)]"></div>
								)}
							</motion.div>
						) : (
							<motion.div
								key="closed"
								initial={{ opacity: 1, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 1, y: 5 }}
								transition={{
									type: "spring",
									bounce: 0.75,
									duration: 0.5,
								}}
								onAnimationComplete={() => {
									updateStore({
										scrollVisible: false,
									});
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
			</div>
		</div>
	);
};

export default Scroll;
