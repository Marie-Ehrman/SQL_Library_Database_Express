//Created using Sequelize CLI

'use strict';

const Sequelize = require('sequelize');

//define a book model
module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({  // initialize Book model with: title, author, genre and year and their dataTypes

    title: {
        type: Sequelize.STRING,
        allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please provide a value for "Title"',
            },
            notEmpty: { // prevent the title value from being set to an empty string
                msg: '"Title" is required'         
            }      
        },
    },

    author: {  
        type: Sequelize.STRING,
        allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
          notNull: {
              msg: 'Please provide a value for "Author"',
          },
          notEmpty: { // prevent the author value from being set to an empty string
              msg: '"Author" is required'
          }      
        },
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
    
    }, { sequelize });

  return Book;
};