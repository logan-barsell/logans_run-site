const showModel = require('../models/Show');
const HomeImage = require('../models/HomeImage');

module.exports = app => {
  app.get('/api/getHomeImages', async (req, res) => {
    try {
      const images = await HomeImage.find();
      res.status(200).send(images);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/removeImage/:id', async (req, res) => {
    try {
      await HomeImage.findOneAndDelete({ _id: req.params.id });
      res.status(200).send('deleted image');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/addHomeImage', async (req, res) => {
    const image = new HomeImage(req.body);
    try {
      await image.save();
      res.status(200).send(image);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/addShow', async (req, res) => {
    const newShow = new showModel(req.body);

    try {
      await newShow.save();
      res.send(newShow);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/shows', async (req, res) => {
    const shows = await showModel.find({}).sort({ date: 1 });
    try {
      res.send(shows);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/api/updateShow/:id', async (req, res) => {
    const updatedShow = {};
    for (let key in req.body) {
      if (req.body[key] !== '') {
        updatedShow[key] = req.body[key];
      }
    }

    try {
      await showModel.findOneAndUpdate({ _id: updatedShow.id }, updatedShow);
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/deleteShow/:id', async (req, res) => {
    try {
      await showModel.findOneAndDelete({ _id: req.params.id });
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
