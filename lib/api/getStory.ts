import axios from "axios";

export default async function getStory() {
	try {
		const { data } = await axios.get("/api/story");

		return data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
