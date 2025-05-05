import { store } from "@/store";
import axios from "axios";

export default async function webhook(notificationToken: string) {
	try {
		const { session } = store.getState();

		await axios.post("/api/webhook", { session, notificationToken });
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
