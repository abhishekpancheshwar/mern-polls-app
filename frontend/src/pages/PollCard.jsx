import React from 'react';
import { Link } from 'react-router-dom';

const PollCard = ({ poll }) => {
  // Calculate total votes for the poll
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Link 
      to={`/poll/${poll._id}`} 
      className="block bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-white mb-2 truncate">{poll.question}</h3>
      <p className="text-sm text-gray-400 mb-4">
        Created by: <span className="font-medium text-indigo-400">{poll.createdBy.username}</span>
      </p>
      <div className="flex justify-between items-center text-gray-300">
        <span className="text-sm">{poll.options.length} options</span>
        <span className="text-sm font-bold">{totalVotes} Total Votes</span>
      </div>
    </Link>
  );
};

export default PollCard;