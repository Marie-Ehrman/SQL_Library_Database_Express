'use strict';

const Sequelize = require('sequelize');

//define a book model
module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
      // initialize Book model with: title, author, genre and year
    title: {
      //initialize DataTypes
      type: Sequelize.STRING,
      allowNull: false, // disallow null
      //set validators to disallow empty fields
      validate: {
          notNull: {
              msg: 'Please provide a value for "Title"',
          },
          notEmpty: {// prevent the title value from being set to an empty string
              // custom error message
              msg: '"Title" is required'         
          }      
      },
    },
    author: {  
      //initialize DataTypes
      type: Sequelize.STRING,
      allowNull: false, // disallow null
      //set validators to disallow empty fields
      validate: {
        notNull: {
            msg: 'Please provide a value for "Author"',
        },
        notEmpty: {// prevent the author value from being set to an empty string
            // custom error message
            msg: '"Author" is required'
        }      
      },
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER,

    }, { sequelize });

  return Book;
};