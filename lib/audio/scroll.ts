import { RefObject } from "react";

export function initScroll(scrollSoundRef: RefObject<HTMLAudioElement | null>) {
	const audioCtx = new AudioContext();
	scrollSoundRef.current = new Audio("/sounds/scroll.mp3");
	const source = audioCtx.createMediaElementSource(scrollSoundRef.current);
	const gainNode = audioCtx.createGain();
	gainNode.gain.value = 0.1;
	source.connect(gainNode).connect(audioCtx.destination);
}
