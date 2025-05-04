import axios from "axios";

export default async function likeStory(session: string, uuid: string) {
	try {
		await axios.post("/api/like", { session, uuid });
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
