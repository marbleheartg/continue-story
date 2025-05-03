import { RefObject } from "react";

export function initPen(penSoundRef: RefObject<HTMLAudioElement | null>) {
	penSoundRef.current = new Audio("/sounds/pen.mp3");
}

export function playPen(
	penSoundRef: RefObject<HTMLAudioElement | null>,
	e: any
) {
	if (
		e.key !== "Backspace" &&
		penSoundRef.current &&
		penSoundRef.current.paused
	) {
		penSoundRef.current.currentTime = 0;
		penSoundRef.current.play().catch(console.warn);
	}
}
