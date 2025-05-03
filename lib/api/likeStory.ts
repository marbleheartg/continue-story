import axios from "axios";

export default async function likeStory(uuid: string, session: string) {
	try {
		const { data } = await axios.post("/api/like", { uuid, session });

		return data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
