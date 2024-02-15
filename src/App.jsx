import './App.css'

import StarCoordinates from './components/StarCoordinates.jsx'

function App() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  return (
    <StarCoordinates height={height} width={width} />
  );
}

export default App
