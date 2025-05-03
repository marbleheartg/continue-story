import getStory from "@/lib/api/getStory";
import likeStory from "@/lib/api/likeStory";
import { startAudio } from "@/lib/audio/background";
import { initPen, playPen } from "@/lib/audio/pen";
import { initScroll } from "@/lib/audio/scroll";
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
	const { user, story, rules, storyPart, scrollOpen, scrollVisible, muted } =
		store();

	const [like, setLike] = useState(story?.likes.some(val => val == user?.fid)!);

	const [suggestion, setSuggestion] = useState<string>(
		begin[Math.floor(Math.random() * begin.length)]
	);

	useEffect(() => {
		setSuggestion(begin[Math.floor(Math.random() * begin.length)]);
	}, [scrollOpen]);

	useEffect(() => {
		setLike(story?.likes.some(val => val == user?.fid)!);
	}, [story]);

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const bgSoundRef = useRef<HTMLAudioElement | null>(null);
	const penSoundRef = useRef<HTMLAudioElement | null>(null);
	const scrollSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		async function init() {
			const { story } = await getStory();

			updateStore({
				story,
				storyPart: { text: "" },
			});
		}

		init();

		initPen(penSoundRef);
		const cleanup = startAudio(bgSoundRef);
		initScroll(scrollSoundRef);

		return () => {
			cleanup();
		};
	}, []);

	return (
		<div className="fixed top-[17vh] left-2 right-2 flex justify-center">
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
									className={`absolute z-10 top-25 left-9 max-w-[80%] text-2xl leading-9 -rotate-1 ${poorStory.className} overflow-hidden`}
									onClick={() => inputRef.current?.focus()}
								>
									{story?.parts &&
										scrollOpen &&
										scrollVisible &&
										(rules.enabled ? (
											<span>{rules.text}</span>
										) : (
											<span>
												<span>
													{story?.parts.map(part => part.text).join("")}{" "}
												</span>
												<span
													className={`${storyPart?.text ? "" : "opacity-30"}`}
												>
													{storyPart?.text || suggestion}
												</span>
												<span>{" _ "}</span>
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
											if (!muted) playPen(penSoundRef, e);
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
									<div>
										<Image
											className="absolute bottom-[4.8%] left-[1.2%] p-2 cursor-pointer object-contain opacity-40"
											src={muted ? "/images/mute.png" : "/images/volume.png"}
											alt="volume"
											width={44}
											height={44}
											draggable="false"
											onClick={() => {
												if (muted) {
													updateStore({ muted: false });
													bgSoundRef.current?.play();
												} else {
													updateStore({ muted: true });
													bgSoundRef.current?.pause();
												}
											}}
										/>

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
														if (!muted)
															scrollSoundRef?.current
																?.play()
																.catch(console.warn);

														updateStore({ scrollOpen: false });

														const { story } = await getStory();

														await updateStore({
															story,
															storyPart: { text: "" },
														});
													} catch (error) {
														console.error("Story reloading error");
													} finally {
														await delay(2000);
														updateStore({ scrollOpen: true });
													}
												}}
											/>
											<Image
												className={`cursor-pointer object-contain ${
													(user?.fid && story?.likes.includes(user?.fid)) ||
													like
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

														const curLike = like;

														setLike(prev => !prev);

														if (story?.uuid && user?.session)
															await likeStory(
																story?.uuid,
																!curLike,
																user?.session
															);
														else throw new Error("Not enough data to like");
													} catch (error) {
														setLike(prev => !prev);
													}
												}}
											/>
										</div>
									</div>
								)}
								{scrollOpen && scrollVisible && (
									<div className="absolute inset-10 -z-10 shadow-[0_0_25px_60px_rgba(0,0,0,0.3)]"></div>
								)}
							</motion.div>
						) : (
							<motion.div
								key="closed"
								initial={{ opacity: 1, y: 120 }}
								animate={{ opacity: 1, y: 120 }}
								exit={{ opacity: 1, x: -500 }}
								transition={{
									type: "spring",
									bounce: 0.7,
									duration: 2,
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

const begin = [
	"It began with a whisper.",
	"The key was glowing again.",
	"She opened the wrong door.",
	"Rain fell on the letter.",
	"He forgot who he was.",
	"The clock struck 13.",
	"Voices echoed in the darks.",
	"They never found the map.",
	"A shadow crossed the moon.",
	"I lied to save him.",
	"Smoke curled from the book.",
	"He knocked. No answer came.",
	"She wore someone else's face.",
	"The forest remembered her.",
	"Glass cracked under his feet.",
	"My name isn't really mine.",
	"The stars blinked out.",
	"It wasn't blood this time.",
	"The painting followed him home.",
	"Silence fell too quickly.",
	"She left through the mirror.",
	"A voice hummed from the sink.",
	"The clouds moved too fast.",
	"His eyes weren't his own.",
	"The door was never there.",
	"Fire danced on the ceiling.",
	"I woke up somewhere else.",
	"Something laughed in the dark.",
	"The bed was still warm.",
	"Her shadow stayed behind.",
	"The walls began to breathe.",
	"He dreamed in other lives.",
	"Keys fell from the sky.",
	"The moonlight felt wrong.",
	"A second sun appeared.",
	"She spoke in backwards words.",
	"The mirror blinked first.",
	"I found teeth in the drawer.",
	"Time ran out at noon.",
	"He vanished mid-sentence.",
];
