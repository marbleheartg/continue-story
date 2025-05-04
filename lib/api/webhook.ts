import axios from "axios";

export default async function webhook(
	session: string,
	notificationToken: string
) {
	try {
		await axios.post("/api/webhook", { session, notificationToken });
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
