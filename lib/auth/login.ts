import axios from "axios";

export async function login(message: string, signature: string, nonce: string) {
	try {
		const { data } = await axios.post("/api/login", {
			message,
			signature,
			nonce,
		});

		return data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message);
	}
}
