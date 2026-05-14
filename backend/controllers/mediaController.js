const Media = require('../models/Media');
const fs = require('fs');

exports.getMedia = async (req, res, next) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ media });
  } catch (err) {
    next(err);
  }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user._id,
    });
    res.status(201).json({ media });
  } catch (err) {
    next(err);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    fs.unlink(media.path, () => {});
    await media.deleteOne();
    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
};
