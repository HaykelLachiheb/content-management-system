const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, authorize('admin', 'editor'), createCategory);
router.put('/:id', protect, authorize('admin', 'editor'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteCategory);

module.exports = router;
