const express = require('express');
const {
  getListingComments,
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/commentsController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const listingCommentsRouter = express.Router({ mergeParams: true });
const commentsRouter = express.Router();

listingCommentsRouter.get('/:id/comments', getListingComments);
listingCommentsRouter.post('/:id/comments', authenticate, createComment);

commentsRouter.get('/', authenticate, requireAdmin, getAllComments);
commentsRouter.put('/:id', authenticate, updateComment);
commentsRouter.delete('/:id', authenticate, deleteComment);
commentsRouter.post('/:id/like', authenticate, likeComment);

module.exports = {
  listingCommentsRouter,
  commentsRouter,
};
