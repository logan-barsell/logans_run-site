const ContactInfo = require('../models/ContactInfo');

module.exports = app => {

    app.get('/api/getContactInfo', async(req, res) => {
        try {
            const info = await ContactInfo.find();
            res.status(200).send(info);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.post('/api/updateContact', async (req, res) => {
        const updatedInfo = req.body;
        try {
            const updatedContactInfo = await ContactInfo.updateOne({ name: 'contactData' }, updatedInfo, { upsert: true });
            res.status(200).send(req.body);
        } catch (err) {
            res.status(500).send(err);
        }
    });
};