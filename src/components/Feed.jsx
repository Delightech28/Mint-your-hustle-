import React, { useEffect, useState } from 'react';

const Feed = ({ getHustles }) => {
  const [hustles, setHustles] = useState([]);

  useEffect(() => {
    const fetchHustles = async () => {
      const data = await getHustles();
      setHustles(data);
    };
    fetchHustles();
  }, [getHustles]);

  return (
    <div className="feed-container">
      <h1>🚀 Proof of Hustle Feed</h1>
      <div id="hustle-list">
        {hustles.map((h, i) => (
          <div className="hustle-card" key={i}>
            <h3>{h.name}</h3>
            <p><strong>Project:</strong> {h.project}</p>
            <p><strong>Link:</strong> <a href={h.link} target="_blank" rel="noopener noreferrer">{h.link}</a></p>
            <p><small>⏰ {new Date(h.timestamp * 1000).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
      <button onClick={() => window.location.href = '/form'}>Submit Another Hustle</button>
      <button style={{ backgroundColor: '#e60000' }} onClick={() => setHustles([])}>Clear All Hustles</button>
    </div>
  );
};

export default Feed; 