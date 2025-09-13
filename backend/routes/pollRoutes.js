const express = require('express');
const {
  getPolls,
  createPoll,
  getPollById,
  voteOnPoll,
  deletePoll
} = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to get all polls, protected route to create one
router.route('/').get(getPolls).post(protect, createPoll);

// Public route to get a single poll, protected route to delete one
router.route('/:id').get(getPollById).delete(protect, deletePoll);

// Protected route to vote on a poll
router.post('/:id/vote', protect, voteOnPoll);

module.exports = router;