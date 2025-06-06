// src/components/Feed.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllHustles } from '../walletService'; // Import the new function
import { useNavigate } from 'react-router-dom'; // For navigation
import { Heart, Share2 } from 'lucide-react'; // Import icons
import { toast } from 'sonner'; // Import toast for notifications

const Feed = () => {
  const [hustles, setHustles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load hustles from the blockchain
  const loadHustles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllHustles();
      // For client-side likes, initialize each hustle with a liked status and count
      const initialHustles = data.map(h => ({
        ...h,
        // Using a simple Math.random() for initial likes for demonstration
        likes: Math.floor(Math.random() * 100),
        isLiked: false,
      }));
      setHustles(initialHustles);
      if (data.length === 0) {
        toast.info("No hustles found!", { description: "Be the first to mint your hustle!" });
      } else {
        toast.success("Hustles loaded!", { description: `${data.length} hustles displayed.` });
      }
    } catch (err) {
      console.error("Failed to load hustles:", err);
      setError("Failed to load hustles. Make sure your wallet is connected and on the correct network.");
      toast.error("Failed to load hustles!", { description: "Please check your network connection." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHustles();
  }, [loadHustles]);

  // Handle client-side liking
  const handleLike = (index) => {
    setHustles(prevHustles =>
      prevHustles.map((hustle, i) =>
        i === index
          ? {
              ...hustle,
              isLiked: !hustle.isLiked,
              likes: hustle.isLiked ? hustle.likes - 1 : hustle.likes + 1,
            }
          : hustle
      )
    );
  };

  // Handle sharing
  const handleShare = async (hustle) => {
    const shareText = `Check out this hustle by ${hustle.fullName} on Proof of Hustle: "${hustle.description}" #ProofOfHustle #Web3Hustle`;
    const shareUrl = window.location.origin + `/feed?hustleId=${hustle.submitter}`; // Example URL, ideally use unique ID
    // Note: The above shareUrl is a placeholder. For real sharing, you'd need unique IDs
    // for each minted hustle and a way to deep-link to them.

    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: 'Proof of Hustle',
          text: shareText,
          url: shareUrl,
        });
        toast.success("Hustle shared successfully!");
      } catch (error) {
        if (error.name !== 'AbortError') { // User might cancel share, which throws AbortError
          console.error('Error sharing:', error);
          toast.error("Failed to share hustle.", { description: error.message });
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.info("Link copied to clipboard!", { description: "You can now paste it to share." });
      } catch (err) {
        console.error('Failed to copy link:', err);
        toast.error("Failed to copy link.", { description: "Please copy manually." });
      }
    }
  };


  // Handle navigation for "Submit Another Hustle" button
  const handleSubmitAnother = () => {
    navigate('/mint-your-hustle'); // Use React Router navigate
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-gray-800 flex flex-col font-sans relative overflow-hidden p-4">
      {/* Subtle Background Blobs (Optional, matching home page) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="flex-grow flex flex-col items-center max-w-7xl mx-auto w-full z-10 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">🚀 Proof of Hustle Feed</h1>

        {loading && <p className="text-lg text-gray-600">Loading hustles...</p>}
        {error && <p className="text-lg text-red-500">{error}</p>}

        {!loading && hustles.length === 0 && !error && (
          <div className="text-center text-lg text-gray-600 mt-8">
            <p>No hustles minted yet.</p>
            <button
              onClick={handleSubmitAnother}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Be the first to Submit Your Hustle
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {hustles.map((h, i) => (
            <div
              className="
                hustle-card bg-white/30 backdrop-filter backdrop-blur-lg backdrop-saturate-150
                rounded-2xl shadow-xl border border-opacity-30 border-white p-6
                flex flex-col justify-between transform transition-transform duration-300 hover:scale-103
              "
              key={i}
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{h.fullName}</h3>
                <p className="text-gray-700 mb-1"><strong>Type:</strong> <span className="font-medium text-purple-700">{h.hustleType}</span></p>
                <p className="text-gray-700 mb-4"><strong>Description:</strong> {h.description}</p>
                <p className="text-sm text-gray-600 mb-4">Submitted by: <span className="font-mono text-blue-700 break-words">{h.submitter.substring(0, 6)}...{h.submitter.substring(h.submitter.length - 4)}</span></p>
              </div>

              {/* Like and Share Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200/50 mt-auto">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(i)}
                    className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200"
                    aria-label={h.isLiked ? "Unlike" : "Like"}
                  >
                    <Heart
                      className={`w-6 h-6 ${h.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
                    />
                    <span className="text-gray-700 font-semibold">{h.likes}</span>
                  </button>
                  <button
                    onClick={() => handleShare(h)}
                    className="p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200"
                    aria-label="Share"
                  >
                    <Share2 className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                {/* Potentially add timestamp here if your contract includes it */}
                {/* <p className="text-sm text-gray-500"><small>⏰ {new Date(h.timestamp * 1000).toLocaleString()}</small></p> */}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons at the bottom */}
        {!loading && hustles.length > 0 && (
          <div className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleSubmitAnother}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Submit Another Hustle
            </button>
            <button
              style={{ backgroundColor: '#e60000' }}
              onClick={() => setHustles([])}
              className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              Clear Displayed Hustles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
