import Keyboard from "./components/Keyboard";

/**
 * Using React as the frontend framework 
 * instead of jQuery or other libraries.
 *
 * The app communicates with the backend via Socket.io 
 * for real-time interactions instead of traditional AJAX requests.
 */

function App() {
	return (
		<div className="App">
			<Keyboard />
		</div>
	);
}

export default App;
