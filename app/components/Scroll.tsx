import getStory from "@/lib/api/getStory";
import likeStory from "@/lib/api/likeStory";
import { store, updateStore } from "@/store";
import { delay } from "@/utils/delay";
import { AnimatePresence, motion } from "framer-motion";
import { Poor_Story } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const poorStory = Poor_Story({
	subsets: ["latin"],
	weight: "400",
});

const Scroll = () => {
	const { user, story, rules, storyPart, scrollOpen, scrollVisible } = store();

	const [like, setLike] = useState(false);

	const inputRef = useRef<HTMLTextAreaElement>(null);
	// const penSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		async function init() {
			const { story } = await getStory();

			updateStore({
				story,
				storyPart: { text: "" },
			});
		}

		init();
		// initPen(penSoundRef);
	}, []);

	return (
		<div
			className="fixed top-[17vh] left-2 right-2 flex justify-center"
			// onClick={() => {
			// 	updateStore(prev => ({ scrollOpen: !prev.scrollOpen }));
			// }}
		>
			<div className="relative max-w-[360px] w-full">
				<div className="relative w-full h-[450px]">
					<AnimatePresence mode="wait">
						{scrollOpen ? (
							<motion.div
								key="open"
								initial={{ y: -20 }}
								animate={{ y: 0 }}
								exit={{ y: 10 }}
								transition={{
									type: "spring",
									bounce: 0.6,
									duration: 1,
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
												{storyPart?.text}
												{" _ "}
												<span
													className={`inline-block blink ${
														storyPart.text.length < 15
															? "text-red-900"
															: "text-green-900"
													}`}
												>
													{30 - storyPart.text.length}
												</span>
											</span>
										))}

									<textarea
										ref={inputRef}
										value={storyPart?.text}
										onKeyDown={e => {
											// playPen(penSoundRef, e);
										}}
										onChange={e => {
											const v = e.target.value;
											const l = v.length;

											if (l >= 31 || v.endsWith("  ")) return;

											updateStore({
												storyPart: {
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
									<div className="flex absolute z-10 bottom-[4%] right-[3%]">
										<Image
											className="cursor-pointer object-contain"
											src="/images/reload.png"
											alt="reload"
											width={38}
											height={38}
											draggable="false"
											onClick={async () => {
												try {
													updateStore({ scrollOpen: false });

													const { story } = await getStory();

													await updateStore({ story });
												} catch (error) {
													console.error("Story reloading error");
												} finally {
													await delay(1500);
													updateStore({ scrollOpen: true });
												}
											}}
										/>
										<Image
											className={`cursor-pointer object-contain ${
												(user?.fid && story?.likes.includes(user?.fid)) || like
													? "opacity-80"
													: "opacity-50"
											}`}
											src="/images/like.png"
											alt="like"
											width={42}
											height={42}
											draggable="false"
											onClick={async () => {
												try {
													const { story, user } = store.getState();

													if (story?.uuid && user?.session)
														await likeStory(story?.uuid, like, user?.session);

													setLike(prev => !prev);
												} catch (error) {}
											}}
										/>
									</div>
								)}
								{scrollOpen && scrollVisible && (
									<div className="absolute inset-10 -z-10 shadow-[0_0_25px_60px_rgba(0,0,0,0.3)]"></div>
								)}
							</motion.div>
						) : (
							<motion.div
								key="closed"
								initial={{ opacity: 1, y: 0 }}
								animate={{ opacity: 1, y: 120 }}
								exit={{ opacity: 1, x: -500 }}
								transition={{
									type: "spring",
									bounce: 0.6,
									duration: 1.5,
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
									draggable="false"
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
