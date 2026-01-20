const PROJECT_TITLE = "continue story"

const PROJECT_DESCRIPTION = "spark a fun short story"

const FRAME = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/ogimage.png`,
  aspectRatio: "3:2",
  button: {
    title: "open",
    action: {
      type: "launch_frame",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: PROJECT_TITLE,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/logo.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
}

const STORY_STARTERS = [
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
]

const IMAGES_TO_PRELOAD = [
  "arrow.svg",
  "bg.jpg",
  "feather.svg",
  "info.svg",
  "like.png",
  "logo.png",
  "mute.png",
  "profile.png",
  "reload.png",
  "scroll.png",
  "scrolled.png",
  "volume.png",
]

export { FRAME, IMAGES_TO_PRELOAD, PROJECT_DESCRIPTION, PROJECT_TITLE, STORY_STARTERS }
