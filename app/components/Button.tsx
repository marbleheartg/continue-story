import { store } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import Image from "next/image";

const Button = () => {
	const rules = useStore(store, s => s.rules);
	const continueText = useStore(store, s => s.continue);

	const mutation = useMutation({
		mutationFn: async () =>
			fetch("/api/story", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ continue: continueText }),
			}).then(res => {
				if (!res.ok) throw new Error("Failed to send");
				return res.json();
			}),
		onSuccess: data => {
			console.log("Saved!", data);
		},
		onError: error => {
			console.error("Error saving:", error);
		},
	});

	return (
		<div className="fixed bottom-13 left-0 right-0 w-full flex justify-center pointer-events-auto">
			<button
				className="flex justify-center w-11/12 py-2.5 bg-white rounded-3xl cursor-pointer"
				onClick={() => {
					if (rules.enabled) {
						store.setState(state => ({
							...state,
							story: "",
							continue: "",
							rules: { enabled: !state.rules.enabled, text: state.rules.text },
						}));
					} else mutation.mutate();
				}}
				disabled={mutation.isPending}
			>
				{rules.enabled ? (
					<Image src="/images/arrow.png" alt="feather" width={32} height={32} />
				) : mutation.isPending ? (
					"..."
				) : (
					<Image
						src="/images/feather.png"
						alt="feather"
						width={32}
						height={32}
					/>
				)}
			</button>
		</div>
	);
};

export default Button;
