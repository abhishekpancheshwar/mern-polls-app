const Poll = require('../models/Poll');
const User = require('../models/User');

// @desc    Get all polls
// @route   GET /api/polls
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: polls });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new poll
// @route   POST /api/polls
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    // The user ID is available from the 'protect' middleware
    const createdBy = req.user.id;

    // Map string options to the required object format
    const pollOptions = options.map(optionText => ({ text: optionText, votes: 0 }));

    const poll = await Poll.create({
      question,
      options: pollOptions,
      createdBy,
    });

    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get a single poll
// @route   GET /api/polls/:id
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('createdBy', 'username');
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }
    res.status(200).json({ success: true, data: poll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Vote on a poll option
// @route   POST /api/polls/:id/vote
exports.voteOnPoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }

    // --- Key Feature: 1 Vote per User ---
    // Check if user has already voted
    const userId = req.user.id;
    if (poll.votedBy.includes(userId)) {
      return res.status(400).json({ success: false, error: 'User has already voted on this poll' });
    }

    // Find the option and increment the vote
    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ success: false, error: 'Option not found' });
    }
    option.votes += 1;

    // Add user's ID to the votedBy array
    poll.votedBy.push(userId);
    await poll.save();
    
    // Populate createdBy after saving to send back full data
    const updatedPoll = await Poll.findById(req.params.id).populate('createdBy', 'username');

    res.status(200).json({ success: true, data: updatedPoll });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a poll
// @route   DELETE /api/polls/:id
exports.deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ success: false, error: 'Poll not found' });
        }

        // Check if the user trying to delete is the one who created it
        if (poll.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this poll' });
        }

        await poll.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};