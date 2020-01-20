const mongoose = require('mongoose');
const Blog = require('../model/app')
const config = require('../config/database')
var jwt = require('jsonwebtoken');

module.exports = (router) =>{

//retrieving data from database
router.get('/blog', (req, res, next) => {
  Blog.find(function (err, blogs) {
        if (err) {
            res.json(err);
        } else {
            res.json(blogs);
        }
    })
});

router.get('/blog/:postHead', (req, res, next) => {
    var postHead = req.params.postHead;
    Blog.findOne({ postHead: req.params.postHead },
        function (err, result) {
            if (err) {
                res.json(err);
            } else {
                res.json(result)
            }
        })
})
router.get('/categories/:categories', (req, res, next) => {
    var categories = req.params.categories;
    Blog.findOne({ categories: req.params.categories },
        function (err, result) {
            if (err) {
                res.json(err);
            } else {
                res.json(result)
            }
        })
})
  return router;
}