const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrls');

const app = express();

app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/urlShortner', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls});
});

app.post('/ShortUrl', async (req, res) => {
    try {
        await ShortUrl.create({ full: req.body.fullUrl });
        res.redirect('/');
        console.log(req.body)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/:shortUrl', async (req, res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})


app.listen(process.env.PORT || 5000);