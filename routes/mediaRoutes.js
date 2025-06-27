const MediaImage = require('../models/MediaImage');
const Video = require('../models/Video');

module.exports = app => {
  app.post('/api/updateVideo', async (req, res) => {
    const updatedVideo = req.body;
    console.log(updatedVideo);
    try {
      await Video.findOneAndUpdate({ _id: updatedVideo._id }, updatedVideo);
      res.status(200).send(updatedVideo);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/deleteVideo/:id', async (req, res) => {
    try {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).send('deleted');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/getVideos', async (req, res) => {
    const qCategory = req.query.category;
    try {
      let videos;
      if (qCategory) {
        videos = await Video.find({ category: qCategory }).sort({ date: -1 });
      } else {
        videos = await Video.find().sort({ date: -1 });
      }
      res.status(200).send(videos);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/addVideo', async (req, res) => {
    console.log(req.body);
    try {
      const video = new Video(req.body);
      await video.save();
      res.status(200).send(video);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/getMediaImages', async (req, res) => {
    try {
      const images = await MediaImage.find().sort({ name: -1 });
      res.status(200).send(images);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/removeMediaImage/:id', async (req, res) => {
    try {
      await MediaImage.findOneAndDelete({ _id: req.params.id });
      res.status(200).send('deleted image');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/addMediaImage', async (req, res) => {
    try {
      // Check if the request body is an array or single object
      if (Array.isArray(req.body)) {
        // Multiple images
        const mediaImages = req.body.map(
          imageData => new MediaImage(imageData)
        );
        const savedImages = await MediaImage.insertMany(mediaImages);
        res.status(200).send(savedImages);
      } else {
        // Single image
        const image = new MediaImage(req.body);
        const savedImage = await image.save();
        res.status(200).send(savedImage);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
