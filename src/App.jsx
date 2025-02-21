import './App.css';

import StarCoordinates from './components/StarCoordinates';

function App() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	return (
		<StarCoordinates height={height} width={width} />
	);
}

export default App;
