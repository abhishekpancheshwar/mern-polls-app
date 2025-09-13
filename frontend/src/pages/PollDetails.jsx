import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`/polls/${id}`);
        setPoll(response.data.data);
      } catch (err) {
        setError('Could not fetch poll details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    setIsVoting(true);
    try {
      const response = await axios.post(`/polls/${id}/vote`, { optionId: selectedOption });
      setPoll(response.data.data); // Update poll with new results from API
    } catch (err) {
      setError(err.response.data.error || 'Failed to submit vote.');
    } finally {
      setIsVoting(false);
    }
  };
  
  const deletePoll = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
        try {
            await axios.delete(`/polls/${id}`);
            navigate('/');
        } catch (err) {
            setError('Could not delete poll.');
        }
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!poll) return <p className="text-center text-white">Poll not found.</p>;

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const hasVoted = user && poll.votedBy.includes(user.id);
  const isCreator = user && poll.createdBy._id === user.id;

  const renderOptions = () => {
    if (!token || hasVoted) {
      // Results View
      return (
        <div className="space-y-3">
          {poll.options.map(option => {
            const percentage = totalVotes === 0 ? 0 : ((option.votes / totalVotes) * 100).toFixed(1);
            return (
              <div key={option._id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-center text-white mb-1">
                  <span>{option.text}</span>
                  <span className="font-bold">{option.votes} votes ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Voting View
      return (
        <form onSubmit={handleVote}>
          <div className="space-y-3">
            {poll.options.map(option => (
              <label
                key={option._id}
                className={`block w-full p-4 rounded-md cursor-pointer transition-all ${selectedOption === option._id ? 'bg-indigo-600 text-white ring-2 ring-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <input
                  type="radio"
                  name="pollOption"
                  value={option._id}
                  checked={selectedOption === option._id}
                  onChange={() => setSelectedOption(option._id)}
                  className="hidden"
                />
                {option.text}
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={!selectedOption || isVoting}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isVoting ? 'Submitting...' : 'Submit Vote'}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center py-12">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl text-white">
        <h2 className="text-3xl font-bold mb-2">{poll.question}</h2>
        <p className="text-sm text-gray-400 mb-6">
          Created by {poll.createdBy.username} &bull; {totalVotes} Total Votes
        </p>
        
        {renderOptions()}

        {isCreator && (
            <button 
                onClick={deletePoll}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                Delete Poll
            </button>
        )}
      </div>
    </div>
  );
};

export default PollDetails;