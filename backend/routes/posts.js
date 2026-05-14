const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/:id', getPost);
router.post('/', protect, authorize('admin', 'editor', 'author'), createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
