var express = require('express');
var router = express.Router();
const Genre = require('../Schemas/Genre');

//get genre list
router.get('/', async (req, res, next) => {
    const genreList = await Genre.find();
    res.status(200).json({ data: genreList });
});

//get genre by id
router.get('/:id', async (req, res, next) => {
    await Genre.find({ _id: req.params.id })
        .then(film => res.status(200).json(film))
        .catch(err => res.status(400).json('Error:'+ err));
});

//create genre
router.post('/create', async (req, res, next) => {
    const newGenre = new Genre(req.body);
    await newGenre.save()
        .then(() => res.status(200).json('Genre added successfully!'))
        .catch(err => res.status(400).json('Error:'+ err));
})

//edit a genre
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    await Genre.findByIdAndUpdate(id, req.body)
        .then(() => res.status(200).json('Genre updated successfully!'))
        .catch(err => res.status(400).json('Error:'+ err));
})


//soft delete a genre
router.delete('/:id/', async (req, res, next) => {
    const id = req.params.id;
    await Genre.findByIdAndUpdate(id, {
        isDeleted: true
    })
    .then(() => res.status(200).json('Genre deleted successfully! ( soft deleted )'))
    .catch(err => res.status(400).json('Error:'+ err));
})

//delete a genre
router.delete('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    await Genre.findByIdAndDelete(id)
       .then(() => res.status(200).json('Genre deleted successfully!'))
       .catch(err => res.status(400).json('Error:'+ err));
})

module.exports = router;