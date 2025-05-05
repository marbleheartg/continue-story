import { store } from "@/store";
import axios from "axios";

export default async function postStory(uuid: string, text: string) {
	try {
		const { session } = store.getState();

		await axios.post("/api/story", { session, uuid, text });
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
