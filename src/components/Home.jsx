// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { connectWallet } from './walletService'; // Your wallet connection function
import { ArrowRight, Shield, Sparkles, Users } from 'lucide-react'; // Import new icons

// Optional: You might have a global CSS file for base styles or custom utilities
//import '../index.css'; // Or wherever your main CSS/Tailwind output is

const Home = () => {
  const navigate = useNavigate();

  // Handler for connecting wallet and then navigating
  const handleConnectWalletAndNavigate = async () => {
    await connectWallet(navigate);
  };

  const handleMintYourHustle = () => {
    navigate('/mint-your-hustle'); // Navigate to your form page
  };

  const handleExploreFeed = () => {
    navigate('/feed'); // Navigate to your feed page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-gray-800 flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Background Blob (Optional, can be a div with absolute positioning) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div> {/* Another blob */}


      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 md:px-8 max-w-7xl mx-auto w-full z-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Mint Your Hustle</h1>
        <button
          onClick={handleConnectWalletAndNavigate}
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-lg font-semibold"
        >
          Connect
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-12 md:py-24 max-w-4xl mx-auto z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
          Mint Your Hustle. <br />
          Share Your Vision. <br />
          <span className="text-purple-600">On-chain.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
          Showcase your projects with immutable proof of work. Connect with builders and
          discover innovations on Base Sepolia.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={handleMintYourHustle}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Mint Your Hustle <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button
            onClick={handleExploreFeed}
            className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Explore Feed
          </button>
        </div>
      </main>

      {/* Features Section Container */}
      <section className="px-4 py-12 md:py-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 z-10">

        {/* Immutable Proof Section */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="mb-6 bg-purple-100 p-4 rounded-full"> {/* Added background to icon container */}
            <Shield className="w-10 h-10 text-purple-600" /> {/* Adjusted icon size slightly */}
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Immutable Proof</h3>
          <p className="text-base text-gray-600 max-w-xs">
            Your projects are permanently recorded on the blockchain, creating an unalterable portfolio.
          </p>
        </div>

        {/* Discover Innovations Section */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="mb-6 bg-blue-100 p-4 rounded-full">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Discover Innovations</h3>
          <p className="text-base text-gray-600 max-w-xs">
            Explore cutting-edge projects from builders worldwide in our curated feed.
          </p>
        </div>

        {/* Connect with Builders Section */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="mb-6 bg-green-100 p-4 rounded-full">
            <Users className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Connect with Builders</h3>
          <p className="text-base text-gray-600 max-w-xs">
            Engage with fellow creators through likes, shares, and building connections.
          </p>
        </div>

      </section>

      {/* Footer (Optional, can be added if needed) */}
      <footer className="py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Proof of Hustle. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;




