const fs = require('fs');
const memberModel = require('../models/Member');
const Bio = require('../models/BioText');

const filePath =
  process.env.NODE_ENV === 'production' ? 'client/build/' : 'client/public/';

module.exports = app => {
  app.get('/api/bio', async (req, res) => {
    try {
      const bio = await Bio.find();
      res.status(200).send(bio);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

  app.post('/api/updateBio', async (req, res) => {
    const content = req.body.data;
    try {
      const updatedBio = await Bio.updateOne(
        { name: 'bio' },
        { text: content },
        { upsert: true }
      );
      console.log(updatedBio);
      res.status(200).send(content);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

  app.post('/api/addMember', async (req, res) => {
    try {
      const newMember = {};
      for (let key in req.body) {
        newMember[key] = req.body[key];
      }
      const member = new memberModel(newMember);
      await member.save();
      res.send(member);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/deleteMember/:id', async (req, res) => {
    try {
      console.log(req.params);
      const response = await memberModel.findOneAndDelete({
        _id: req.params.id,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    res.end();
  });

  app.get('/api/members', async (req, res) => {
    const members = await memberModel.find({});
    res.send(members);
  });

  app.post('/api/updateMember/:id', async (req, res) => {
    try {
      const updatedMember = {};
      for (let key in req.body) {
        if (req.body[key] !== '') {
          updatedMember[key] = req.body[key];
        }
      }
      await memberModel.findOneAndUpdate(
        { _id: updatedMember.id },
        updatedMember
      );
      res.end();
    } catch (err) {
      console.log('HERE IS THE ERROR', err);
      res.status(500).end();
    }
  });
};
