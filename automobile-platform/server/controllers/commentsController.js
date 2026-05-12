const { Comment, Listing, User } = require('../models');

const getListingComments = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    const comments = await Comment.findAll({
      where: { listingId: listing.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load comments.' });
  }
};

const getAllComments = async (_req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role'],
        },
        {
          model: Listing,
          as: 'listing',
          attributes: ['id', 'title'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load admin comments.' });
  }
};

const createComment = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required.' });
    }

    const comment = await Comment.create({
      userId: req.user.id,
      listingId: listing.id,
      content,
    });

    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role'],
        },
      ],
    });

    return res.status(201).json(createdComment);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create comment.' });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (req.user.role !== 'admin' && comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'You cannot edit this comment.' });
    }

    if (!req.body.content) {
      return res.status(400).json({ message: 'Comment content is required.' });
    }

    comment.content = req.body.content;
    await comment.save();

    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role'],
        },
      ],
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update comment.' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (req.user.role !== 'admin' && comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'You cannot delete this comment.' });
    }

    await comment.destroy();
    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete comment.' });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    comment.likes += 1;
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to like comment.' });
  }
};

module.exports = {
  getListingComments,
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
