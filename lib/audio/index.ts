import { RefObject } from "react";

export function startAudio(bgSoundRef: RefObject<HTMLAudioElement | null>) {
	const audioCtx = new AudioContext();
	bgSoundRef.current = new Audio("/sounds/bg.wav");
	bgSoundRef.current.loop = true;
	const source = audioCtx.createMediaElementSource(bgSoundRef.current);
	const gainNode = audioCtx.createGain();
	gainNode.gain.value = 0.1;
	source.connect(gainNode).connect(audioCtx.destination);
	bgSoundRef.current.play().catch(console.warn);
}
