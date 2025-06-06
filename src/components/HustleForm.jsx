import React, { useState } from 'react';

const HustleForm = ({ submitHustle }) => {
  const [fullName, setFullName] = useState('');
  const [hustleType, setHustleType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitHustle(fullName, hustleType, description);
  };

  return (
    <div className="container">
      <h1>Submit Your Hustle</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your Name" required /><br /><br />
        <input type="text" value={hustleType} onChange={e => setHustleType(e.target.value)} placeholder="What are you building?" required /><br /><br />
        <input type="url" value={description} onChange={e => setDescription(e.target.value)} placeholder="Link to demo / GitHub" required /><br /><br />
        <button type="submit">Mint On-Chain</button>
      </form>
    </div>
  );
};

export default HustleForm; 