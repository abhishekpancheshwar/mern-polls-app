import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PollCard from '../pages/PollCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('/polls');
        setPolls(response.data.data);
      } catch (err) {
        setError('Failed to fetch polls. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading polls...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Polls Dashboard</h1>
          <Link 
            to="/create-poll" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Create New Poll
          </Link>
        </div>

        {polls.length === 0 ? (
          <div className="text-center bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">No Polls Found</h2>
            <p className="text-gray-400">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll._id} poll={poll} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;