// components/Feed.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllHustles } from './walletService'; // Import the new function
import { useNavigate } from 'react-router-dom'; // For navigation

const Feed = () => { // No need to pass getHustles as a prop now
  const [hustles, setHustles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadHustles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllHustles();
      setHustles(data);
    } catch (err) {
      console.error("Failed to load hustles:", err);
      setError("Failed to load hustles. Make sure your wallet is connected and on the correct network.");
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies for now, as fetchAllHustles is constant

  useEffect(() => {
    loadHustles();
  }, [loadHustles]);

  // Handle navigation for "Submit Another Hustle" button
  const handleSubmitAnother = () => {
    navigate('/mint-your-hustle'); // Use React Router navigate
  };

  return (
    <div className="feed-container">
      <h1>🚀 Proof of Hustle Feed</h1>
      {loading && <p>Loading hustles...</p>}
      {error && <p className="error-message">{error}</p>}
      <div id="hustle-list">
        {hustles.length === 0 && !loading && !error && (
          <p>No hustles minted yet. Be the first!</p>
        )}
        {hustles.map((h, i) => (
          <div className="hustle-card" key={i}>
            {/* Use the correct property names from your contract */}
            <h3>{h.fullName}</h3>
            <p><strong>Type:</strong> {h.hustleType}</p>
            <p><strong>Description:</strong> {h.description}</p>
            <p><small>Submitted by: {h.submitter}</small></p>
            {/* If you add a timestamp to your contract, uncomment and adjust this */}
            {/* <p><small>⏰ {new Date(h.timestamp * 1000).toLocaleString()}</small></p> */}
          </div>
        ))}
      </div>
      <button onClick={handleSubmitAnother}>Submit Another Hustle</button>
      {/* Consider what "Clear All Hustles" means. If it's only client-side, it's fine.
          If it implies clearing on-chain, that would require a contract function. */}
      <button style={{ backgroundColor: '#e60000' }} onClick={() => setHustles([])}>Clear Displayed Hustles</button>
    </div>
  );
};

export default Feed;
