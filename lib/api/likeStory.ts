import { store } from "@/store";
import axios from "axios";

export default async function likeStory(uuid: string) {
	try {
		const { session } = store.getState();

		await axios.post("/api/like", { session, uuid });
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
