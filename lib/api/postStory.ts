import axios from "axios";

export default async function postStory(
	uuid: string,
	text: string,
	session: string
) {
	try {
		await axios.post("/api/story", { uuid, text, session });
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
