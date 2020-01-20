const mongoose = require('mongoose');
var multer = require('multer');
const Blog = require('../model/app')
const User = require('../model/users')
const config = require('../config/database')
var fs = require('fs')

module.exports = (router) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  const upload = multer({
    storage: storage, limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

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

  //inserting new data 
  router.post('/blog', upload.any(), (req, res, next) => {
    if (req.files) {
      req.files.forEach(function (file) {
        let date_ob = new Date();

        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // current year
        let year = date_ob.getFullYear();

        // current hours
        let hours = date_ob.getHours();

        // current minutes
        let minutes = date_ob.getMinutes();

        // current seconds
        let seconds = date_ob.getSeconds();
        console.log(file)
        var filename = year + "-" + month + "-" + date + "_" + hours + "-" + minutes + "-" + seconds + "_" + file.originalname
        fs.rename(file.path, '../frontend/images/uploads/' + filename, function (err) {
          if (err) throw err;
          console.log('file uploaded...');
          let newBlog = new Blog({
            postHead: req.body.postHead.replace(/ |\?/g, "-").replace(/\?/g, ""),
            postContent: req.body.postContent,
            publishDate: req.body.publishDate,
            postImage: filename,
            createdBy: req.body.createdBy,
            categories: req.body.categories
          })
          console.log(newBlog)

          newBlog.save((err, blog) => {
            if (err) {
              res.json(err)
            } else {
              res.json({ msg: 'blog has been add successfully' })
            }
          })

        })

      })
    }else{
      let newBlog = new Blog({
        postHead: req.body.postHead.replace(/ |\?/g, "-").replace(/\?/g, ""),
        postContent: req.body.postContent,
        publishDate: req.body.publishDate,
        createdBy: req.body.createdBy
      })
      newBlog.save((err, blog) => {
        if (err) {
          res.json(err)
        } else {
          res.json({ msg: 'blog has been add successfully' })
        }
      })
    }

  })


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
  /* ===============================================================
       COMMENT ON BLOG POST
    =============================================================== */
  router.post('/comment', (req, res) => {
    var comment_id = mongoose.Types.ObjectId();
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body._id) {
        res.json({ success: false, message: 'No id was provided' }); // Return error message
      } else {
        // Use id to search for blog post in database
        Blog.findOne({ _id: req.body._id }, (err, blog) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid blog id' }); // Return error message
          } else {
            // Check if id matched the id of any blog post in the database
            if (!blog) {
              res.json({ success: false, message: 'Blog not found.' }); // Return error message
            } else {
              // Grab data of user that is logged in
              User.findOne({ username: req.decoded.username }, (err, user) => {
                // Check if error was found
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' }); // Return error message
                } else {
                  // Check if user was found in the database
                  if (!user) {
                    res.json({ success: false, message: 'User not found.' }); // Return error message
                  } else {
                    // Add the new comment to the blog post's array
                    blog.comments.push({
                      _id: comment_id,
                      comment: req.body.comment,
                      commentator: user.name,
                      email: user.email,
                      commentDate: req.body.commentDate,
                      userImage: user.userImage
                    });
                    // Save blog post
                    blog.save((err) => {
                      // Check if error was found
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
  router.post('/reply', function (req, res) {
    //var reply_id = ObjectID();
    var reply_id = mongoose.Types.ObjectId();
    User.findOne({ username: req.decoded.username }, (err, user) => {
      // Check if error was found
      if (err) {
        res.json({ success: false, message: 'Something went wrong' }); // Return error message
      } else {
        // Check if user was found in the database
        if (!user) {
          res.json({ success: false, message: 'User not found.' }); // Return error message
        } else {
          Blog.updateOne({
            "_id": mongoose.Types.ObjectId(req.body.post_id),
            "comments._id": mongoose.Types.ObjectId(req.body.comments_id)
          }, {
            $push: {
              "comments.$.replies": {
                _id: reply_id,
                name: user.name,
                reply: req.body.reply,
                emailId: user.email
              }
            }
          }, function (error, document) {
            res.send({ text: "Replied" })
          })
        }
      }
    });
  });
  //updating data
  // router.put('/blog/:id', (req, res, next) => {
  //   Blog.findOneAndUpdate({ _id: req.params.id }, {
  //     $set: {
  //       postHead: req.body.postHead,
  //       postContent: req.body.postContent
  //     }
  //   },
  //     function (err, result) {
  //       if (err) {
  //         res.json(err);
  //       } else {
  //         res.json(result)
  //       }
  //     })
  // })
  router.put('/blog/:id', upload.any(), function (req, res, next) {
    if (req.files) {
      req.files.forEach(function (file) {
        let date_ob = new Date();

        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // current year
        let year = date_ob.getFullYear();

        // current hours
        let hours = date_ob.getHours();

        // current minutes
        let minutes = date_ob.getMinutes();

        // current seconds
        let seconds = date_ob.getSeconds();
        console.log(file)
        var filename = year + "-" + month + "-" + date + "_" + hours + "-" + minutes + "-" + seconds + "_" + file.originalname
        fs.rename(file.path, '../frontend/images/uploads/' + filename, function (err) {
          if (err) throw err;
          Blog.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
              postHead: req.body.postHead.replace(/ /g, "-").replace(/\?/g, ""),
              postContent: req.body.postContent,
              postImage: filename,
              categories: req.body.categories
            }
          },
            function (err, result) {
              if (err) {
                res.json({success: false, message: "Something went wrong",err});
              } else {
                res.json({success: true, message: "Blog has updated successfully!!",result})
              }
            })
        })

      })
    }else{
      Blog.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
          postHead: req.body.postHead.replace(/ /g, "-").replace(/\?/g, ""),
          postContent: req.body.postContent
        }
      },
        function (err, result) {
          if (err) {
            res.json({success: false, message: "Something went wrong",err});
          } else {
            res.json({success: true, message: "Blog has updated successfully!!",result})
          }
        })
    }
  });
  router.delete('/blog/:id', (req, res, next) => {
    Blog.remove({ _id: req.params.id }, function (err, result) {
      if (err) {
        res.json(err)
      } else {
        res.json(result)
      }
    })
  })
  router.put('/likeBlog', (req, res, next) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if id matched the id of a blog post in the database
          if (!blog) {
            res.json({ success: false, message: 'That blog was not found.' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ username: req.decoded.username }, function (err, user) {
              //User.findOne({ username: req.body.username }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the blog post
                  if (user.name === blog.createdBy) {
                    res.json({ success: false, message: 'Cannot like your own post.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the blog post before
                    if (blog.likedBy.includes(user.name)) {
                      res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (blog.dislikedBy.includes(user.name)) {
                        blog.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = blog.dislikedBy.indexOf(user.name); // Get the index of the username in the array for removal
                        blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                        blog.likes++; // Increment likes
                        blog.likedBy.push(user.name); // Add username to the array of likedBy array
                        // Save blog post data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.likes++; // Incriment likes
                        blog.likedBy.push(user.name); // Add liker's username into array of likedBy
                        // Save blog post
                        blog.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DISLIKE BLOG POST
  =============================================================== */
  router.put('/dislikeBlog', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search database for blog post using the id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if blog post with the id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'That blog was not found.' }); // Return error message
          } else {
            // Get data of user who is logged in
            User.findOne({ username: req.decoded.username }, function (err, user) {
              // User.findOne({ username: req.body.username }, function(err, user) {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who disliekd post is the same person who originated the blog post
                  if (user.name === blog.createdBy) {
                    res.json({ success: false, message: 'Cannot dislike your own post.' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (blog.dislikedBy.includes(user.name)) {
                      res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (blog.likedBy.includes(user.name)) {
                        blog.likes--; // Decrease likes by one
                        const arrayIndex = blog.likedBy.indexOf(user.name); // Check where username is inside of the array
                        blog.likedBy.splice(arrayIndex, 1); // Remove username from index
                        blog.dislikes++; // Increase dislikeds by one
                        blog.dislikedBy.push(user.name); // Add username to list of dislikers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.dislikes++; // Increase likes by one
                        blog.dislikedBy.push(user.name); // Add username to list of likers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });
  return router;
}