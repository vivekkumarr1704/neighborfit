const { useState } = React;

function App() {
  const [preferences, setPreferences] = useState({
    safety: 0.4,
    cost: 0.3,
    amenities: 0.2,
    walkability: 0.1
  });
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          safety_weight: preferences.safety,
          cost_weight: preferences.cost,
          amenities_weight: preferences.amenities,
          walkability_weight: preferences.walkability
        })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NeighborFit</h1>
      <div className="mb-4">
        <label className="block">Safety</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={preferences.safety}
          onChange={(e) => setPreferences({ ...preferences, safety: parseFloat(e.target.value) })}
          className="w-full"
        />
        <label className="block">Cost</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={preferences.cost}
          onChange={(e) => setPreferences({ ...preferences, cost: parseFloat(e.target.value) })}
          className="w-full"
        />
        <label className="block">Amenities</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={preferences.amenities}
          onChange={(e) => setPreferences({ ...preferences, amenities: parseFloat(e.target.value) })}
          className="w-full"
        />
        <label className="block">Walkability</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={preferences.walkability}
          onChange={(e) => setPreferences({ ...preferences, walkability: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Find Matches
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Results</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index} className="p-2 border-b">
              {result.name}: Score {result.score.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));