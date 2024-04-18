var express = require('express');
var router = express.Router();
const Movie = require('../Schemas/Movie');

//get movies list
router.get('/', async (req, res, next) => {
    const movieList = await Movie.find({});
    res.status(200).json({ data: movieList });
});



router.get('/discover', async (req, res, next) => {
    try {
      // Build the query object dynamically
      const query = {};
      if (req.query.with_genres) {
        // Convert genre IDs to integers if necessary
        const genreIds = req.query.with_genres.split(',').map(genreId => parseInt(genreId, 10));
        query.genre_ids = { $in: genreIds }; // Use $in operator for array containment
      }
  
      // Fetch movies based on the query
      const movieList = await Movie.find(query);
  
      // Handle successful response
      res.status(200).json({ data: movieList });
    } catch (error) {
      // Handle errors gracefully
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching movies' });
    }
  });

  router.get('/search', async (req, res, next) => {
    try {
      // Build the query object dynamically
      const query = {};
      if (req.query.search) {
        // Perform partial title match using regular expression
        const searchTerm = req.query.search.trim(); // Trim leading/trailing spaces
        query.title = new RegExp(`^${searchTerm}`, 'i'); // Case-insensitive partial match
      }
  
      // Fetch movies based on the query
      const movieList = await Movie.find(query);
  
      // Handle successful response
      res.status(200).json({ data: movieList });
    } catch (error) {
      // Handle errors gracefully
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching movies' });
    }
  });

router.get('/upcoming', async (req, res, next) => {
    const movieList = await Movie.find({ movie_type: 'upcoming'} );
    res.status(200).json({ data: movieList });
});

router.get('/top_rated', async (req, res, next) => {
    const movieList = await Movie.find({ movie_type: 'top_rated'} );
    res.status(200).json({ data: movieList });
});

router.get('/popular', async (req, res, next) => {
    const movieList = await Movie.find({ movie_type: 'popular'} );
    res.status(200).json({ data: movieList });
});

//get movie by id
router.get('/:id', async (req, res, next) => {
    await Movie.findOne({ _id: req.params.id })
        .then(movies => res.status(200).json({data: movies}))
        .catch(err => res.status(400).json('Error:'+ err));
});

//create a movie
router.post('/create', async (req, res, next) => {
    const newMovie = new Movie(req.body);
    await newMovie.save()
        .then(() => res.status(200).json('Movie added successfully!'))
        .catch(err => res.status(400).json('Error:'+ err));
})

//edit a movie
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    await Movie.updateOne({ _id: id}, req.body)
        .then(() => res.status(200).json('Movie updated successfully!'))
        .catch(err => res.status(400).json('Error:'+ err));
})


//soft delete a movie
router.delete('/:id', async(req, res, next) => {
    const id = req.params.id;
    await Movie.delete({ _id: id })
        .then(() => res.status(200).json('Movie deleted successfully'))
        .catch(err => res.status(400).json('Error:'+ err));
})

//delete a movie
router.delete('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    await Movie.findByIdAndDelete(id)
       .then(() => res.status(200).json('Movie deleted successfully!'))
       .catch(err => res.status(400).json('Error:'+ err));
})

module.exports = router;