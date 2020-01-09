const express = require('express');
const router = express.Router();
const Book = require('../models').Book; //import the book model with ".Book", we can now use all ORM methods



//Handler middleware function for route callbacks
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [[ 'title', 'ASC' ]] } ); // order by title
    res.render("books/index", { books: books.map(book => book = book.dataValues), title: "Books!" });
})); //THIS WORKS

// Create a new book form.
// When the path is books/new the "new" pug template is rendered passing it an empty book object
router.get('/new', (req, res) => {
  console.log('in the create book route');
    res.render("books/new", { book: {}, title: "New Book"});
});

/* POST create book. */
router.post('/', asyncHandler(async (req, res) => {
  //JUST GET THE PAGE TO LOAD
 // pass the redirect the route to the individual book
  //   //It builds a new model instance and creates a new row, automatically storing the data in the instance
    let book;
    try {
      book = await Book.create(req.body);  //create requires an object that maps the books data
      res.redirect("/books" + book.id);
    } catch (error) {
      if(error.name === "SequelizeValidationError") { // check for the SequelizeValidationError error
        book = await Book.build(req.body);
        res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })); //sequelize creates an autoincrementing id, we will use this to add it to the books path

/* Edit book form. */
router.get('/:id/edit', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/edit", { book, title: "Edit book" });      
  } else {
    res.sendStatus(404);
  }
}));

/* GET individual book. */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/book", { book, title: book.title });  
  } else {
    res.sendStatus(404);
  }
}));

/* Update an book. */
//In this case, when building the book instance, we explicitly add the book ID,
//since the ID is in the URL as a parameter (:id) and not in req.body.
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await Book.update(req.body);
      res.redirect("books/update-book/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("books/update-book", { book, errors: error.errors, title: "Edit book" })
    } else {
      throw error;
    }
  }
}));

/* Delete book form. */
router.get('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/delete", { book, title: "Delete book" });
  } else {
    res.sendStatus(404);
  }
}));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await Book.destroy();
    res.redirect("/");
  } else {
    res.sendStatus(404);
  }
}));


module.exports = router;