import { useEffect, useState } from "react";
import io from "socket.io-client";

// Function to get userId from URL
const getUserIdFromURL = () => {
	const params = new URLSearchParams(window.location.search);
	return params.get("userId") || "1"; // Default to "1" if not provided
};

// Get userId from URL
const userId = getUserIdFromURL();
/**
 * Extracting userId from the URL query parameters.
 * Example: http://localhost:3000/?userId=1
 * This ensures each user gets a unique identifier when accessing the application.
 */

const socket = io("http://localhost:5000", {
	query: { userId },
});

function Keyboard() {
	const [keys, setKeys] = useState(Array(10).fill("white"));
	const [hasControl, setHasControl] = useState(false);

	useEffect(() => {
		socket.on("updateKeys", (newKeys) => {
			if (Array.isArray(newKeys)) {
				setKeys(newKeys);
			}
		});

		socket.on("controlGranted", (id) => {
			setHasControl(id === Number(userId));
		});

		socket.on("controlReleased", () => {
			setHasControl(false);
		});

		return () => {
			socket.off("updateKeys");
			socket.off("controlGranted");
			socket.off("controlReleased");
		};
	}, []);

	const acquireControl = () => {
		socket.emit("acquireControl", { userId }, (response) => {
			if (response.success) {
				setHasControl(true);
			} else {
				alert(`User ${response.ownerId} already has control`);
			}
		});
	};

	const toggleKey = (index) => {
		if (!hasControl) {
			alert("You don't have control!");
			return;
		}

		const newKeys = [...keys];
		newKeys[index] =
			newKeys[index] === "white"
				? userId === "1"
					? "red"
					: "yellow"
				: "white";

		socket.emit("updateKeys", { userId, newKeys });
	};

	return (
		<div>
			<h1>Remote Keyboard App</h1>
			<h2>Your ID: {userId}</h2>
			<button
				onClick={acquireControl}
				disabled={hasControl}
			>
				Acquire Control
			</button>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(5, 50px)",
					gap: "5px",
				}}
			>
				{keys.map((color, index) => (
					<div
						key={index}
						onClick={() => toggleKey(index)}
						style={{
							width: "50px",
							height: "50px",
							backgroundColor: color,
							border: "1px solid black",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "18px",
							fontWeight: "bold",
						}}
					>
						{index + 1}
					</div>
				))}
			</div>
		</div>
	);
}

export default Keyboard;
