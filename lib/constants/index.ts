const PROJECT_TITLE = "continue story"

const PROJECT_DESCRIPTION = "spark a fun short story"

const FRAME = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/ogimage.png`,
  aspectRatio: "3:2",
  button: {
    title: "clean",
    action: {
      type: "launch_frame",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: PROJECT_TITLE,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/logo.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
}

export { FRAME, PROJECT_DESCRIPTION, PROJECT_TITLE }
