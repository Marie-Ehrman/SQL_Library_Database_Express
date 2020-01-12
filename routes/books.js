const express = require('express');
const router = express.Router();
const Book = require('../models').Book; //import the book model with ".Book", we can now use all ORM methods



//Middleware handler function for route callbacks
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
      }
    }
}


//****** SELECT BOOKS LIST
router.get('/', asyncHandler(async (req, res) => {

      const books = await Book.findAll({ // get all books from the db
            order: [[ 'title', 'ASC' ]]  // order by title
      } );

      res.render("books/index", { books } ); //render the books list via the index view by passing the books local

}));


//****** NEW BOOK FORM
// When the path is books/new the "new" pug template is rendered passing it an empty book object
router.get('/new', (req, res) => {

      res.render("books/new-book", { book: {} });

});


//******** CREATE BOOK
router.post('/', asyncHandler(async (req, res) => {

      let book;
      try {
        book = await Book.create(req.body);  //pass request body to the create method
        res.redirect("/books/" + book.id);
      } catch (error) {
        if(error.name === "SequelizeValidationError") { // check for the SequelizeValidationError error
          book = await Book.build(req.body);
          console.log(error);
          res.render("books/form-error", { book, errors: error.errors})
        } else {
          throw error; // error caught in the asyncHandler's catch block
        }
      }

  })); //sequelize creates an autoincrementing id, we will use this to add it to the books path


//******** SELECT BOOK BY ITS ID
router.get('/:id', asyncHandler(async (req, res) => {

    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("books/update-book", { book });  
    } else {
      res.render("books/page-not-found");  
    }

}));


//******** UPDATE BOOK
// explicitly add the book ID since the ID is in the URL as a parameter (:id) and not in req.body.
router.post('/:id', asyncHandler(async (req, res) => {

    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body);
        console.log(book);
        res.redirect("/books/" + book.id); 
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id; // make sure correct book gets updated
        res.render("books/update-book", { book, errors: error.errors})
      } else {
        throw error;
      }
    }

}));


//******** DELETE BOOK FORM
router.get('/:id/delete', asyncHandler(async (req, res) => {

    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("books/delete", { book });
    } else {
      res.render("books/page-not-found");  
    }

}));

//******** DELETE BOOK
router.post('/:id/delete', asyncHandler(async (req ,res) => {

    const book = await Book.findByPk(req.params.id);
    if(book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.render("books/page-not-found");  
    }

}));


module.exports = router;