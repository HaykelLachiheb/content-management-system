const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');

router.get('/', protect, getMedia);
router.post('/', protect, upload.single('file'), uploadMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
