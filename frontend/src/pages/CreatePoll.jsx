import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with two empty options
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) { // Limit to 6 options
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) { // Must have at least 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const filledOptions = options.filter(opt => opt.trim() !== '');
    if (!question.trim() || filledOptions.length < 2) {
      return setError('Please provide a question and at least two options.');
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('/polls', { question, options: filledOptions });
      navigate('/');
    } catch (err) {
      setError('Failed to create poll. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Create a New Poll</h2>

        {error && <p className="bg-red-500 text-white p-3 rounded-md text-center mb-4">{error}</p>}

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="question">
              Poll Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="ml-2 text-red-500 hover:text-red-400 font-bold">
                    X
                  </button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button type="button" onClick={addOption} className="mt-2 text-indigo-400 hover:text-indigo-300 font-semibold">
                + Add Option
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;