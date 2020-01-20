app.controller('homeCtrl', ['$scope', '$http', '$routeParams', 'User', 'toaster', function ($scope, $http, $routeParams, User, toaster) {
  $scope.post = {};
  var refresh = function () {
    $http.get("/blog/categories/" + $routeParams.categories).then(function (response) {
      $scope.post = response.data;
      $scope.category = $routeParams.categories;
    })
    $http.get("/blog/blog/" + $routeParams.postHead).then(function (response) {
      $scope.post = response.data;
      $scope.likeBlog = function (id) {
        var id = $scope.post._id;
        User.likeBlog(id).then(function (data) {
          console.log(data)
          $scope.successMsg = false;
          $scope.errorMsg = false;
          if (data.data.success) {
            $scope.successMsg = data.data.message;
            toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
          } else {
            if (data.data.message === "No token provided") {
              $scope.errorMsg = "Please login for like";
              toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
            } else {
              $scope.errorMsg = data.data.message;
              toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
            }
          }
        })
      }
      
      $scope.dislikeBlog = function (id) {

        var id = $scope.post._id;
        User.dislikeBlog(id).then(function (data) {
          console.log(data)
          $scope.successMsg = false;
          $scope.errorMsg = false;
          if (data.data.success) {
            $scope.successMsg = data.data.message;
            toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
          } else {
            if (data.data.message === "No token provided") {
              $scope.errorMsg = "Please login for dislike";
              toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
            } else {
              $scope.errorMsg = data.data.message;
              toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
            }
          }
        })
      }
    });
    $http.get('/blog/blog').then(function (response) {
      //console.log("I got the data that I requested");
      $scope.posts = response.data
      //console.log($scope.posts[0]._id);
      $scope.post = '';

      // User.likeBlog().then(function () {
      //   var allData = response.data.length;
      //   var allData1 = response.data[1].likedBy;
      //   //var blogdata = allData.indexOf($scope.name)
      //   console.log(allData1)
      //   var likedUsers = response.data.likedBy;
        
      //   var disLikedUsers = response.data.dislikedBy;
      //   var a = likedUsers.indexOf($scope.name);
      //   var b = disLikedUsers.indexOf($scope.name);
      //   $scope.likedUser = a;
      //   $scope.dislikedUser = b;
      // })
    });
  }
  $scope.post = { 'name': $scope.name }
  refresh();

  $scope.deletePost = function (id) {
    refresh();
    if (confirm('Do you really want to delete?')) {
      //console.log("Removed:" + id);
      $http.delete('/blog/blog/' + id).then(function (response) { });
    }
  };
}])

app.controller('postCtrl', ['$scope', '$http', '$location', '$compile', '$timeout', 'toaster', function ($scope, $http, $location, $compile, $timeout, toaster) {
  $compile(angular.element('.textarea-filed'))($scope);
  $scope.post = { 'createdBy': $scope.name }
  //console.log($scope.post)
  var refresh = function () {
    $scope.postSubmit = function () {

      var formData = new FormData;

      for (key in $scope.post) {
        formData.append(key, $scope.post[key]);
      }

      var file = $("#postImage")[0].files[0];
      if (file == undefined) {
        $http.post('/blog/blog', $scope.post).then(function (response) {
          $scope.successMsg = response.data.msg;
          toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
          console.log(response)
        })
      }
      formData.append('postImage', file);
      //console.log(file, "file...")
      //console.log($scope.post);
      $http.post("/blog/blog", formData, {
        transformRequest: angular.identity,
        headers: {
          'content-Type': undefined
        }
      }).then(function (response) {
        $scope.successMsg = response.data.msg;
          toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      });
      $timeout(function () {
        $location.url('/')
      }, 2000)
    }
  }
  refresh();
}]);

app.controller('editCtrl', ['$scope', '$http', '$routeParams', '$location', '$compile', '$window', 'User', 'toaster', '$timeout', function ($scope, $http, $routeParams, $location, $compile, $window, User, toaster, $timeout) {
  $compile(angular.element('.textarea-filed'))($scope);
  $scope.post = {};
  
  $http.get("/blog/blog/" + $routeParams.postHead).then(function (response) {
    $scope.post = response.data;
    $scope.likeBlog = function (id) {

      var id = $scope.post._id;
      console.log(id)
      User.likeBlog(id).then(function (data) {
        console.log(data)
        $scope.successMsg = false;
        $scope.errorMsg = false;
        if (data.data.success) {
          $scope.successMsg = data.data.message;
          toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
        } else {
          if (data.data.message === "No token provided") {
            $scope.errorMsg = "Please login for like";
            toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
          } else {
            $scope.errorMsg = data.data.message;
            toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
          }
        }
      })
    }
      
      
    $scope.dislikeBlog = function (id) {

      var id = $scope.post._id;
      User.dislikeBlog(id).then(function (data) {
        console.log(data)
        $scope.successMsg = false;
        $scope.errorMsg = false;
        if (data.data.success) {
          $scope.successMsg = data.data.message;
          toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
        } else {
          if (data.data.message === "No token provided") {
            $scope.errorMsg = "Please login for dislike";
            toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
          } else {
            $scope.errorMsg = data.data.message;
            toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
          }
        }
      })
    }
    User.likeBlog().then(function () {
      var likedUsers = response.data.likedBy;
      var disLikedUsers = response.data.dislikedBy;
      var a = likedUsers.indexOf($scope.name);
      var b = disLikedUsers.indexOf($scope.name);
      $scope.likedUser = a;
      $scope.dislikedUser = b;
    })
  });
  $scope.replyBtn = function ($event) {
    $scope.reply = { "post_id": $scope.post._id, 'comments_id': $event.target.value }
  }
  $scope.update = function () {
    var formData = new FormData;

    for (key in $scope.post) {
      formData.append(key, $scope.post[key]);
    }

    var file = $("#postImage")[0].files[0];
    if (file == undefined) {
      $http.put('/blog/blog/' + $scope.post._id, $scope.post).then(function (response) {
        $scope.successMsg = response.data.message;
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
        console.log(response)
      })
    }
    formData.append('postImage', file);
    $http.put('/blog/blog/' + $scope.post._id, formData, {
      transformRequest: angular.identity,
      headers: {
        'content-Type': undefined
      }
    }).then(function (response) { })
    $timeout(function () {
      $location.url('/')
    }, 1000)
  }

  $scope.commentSubmit = function () {
    $http.post('/blog/comment', $scope.post).then(function (data) {
      console.log(data)
      $scope.successMsg = false;
      $scope.errorMsg = false;
      if (data.data.success) {
        $scope.successMsg = data.data.message;
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      } else {
        if (data.data.message === "No token provided") {
          $scope.errorMsg = "Please login for comment";
          toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
        } else {
          $scope.errorMsg = data.data.message;
          toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
        }
      }
    });
  }

  $scope.replySubmit = function ($index) {
    $http.post('/blog/reply', $scope.reply).then(function (response) {
      console.log(response)
    });
    $window.location.reload();
  }

}]);

app.controller('userCtrl', ['$scope', '$http', '$location', '$timeout', 'User', 'toaster', function ($scope, $http, $location, $timeout, User, toaster) {
  $scope.regUser = function (regData) {
    $scope.errorMsg = false;
    $scope.successMsg = false;
    $scope.loading = true;

    User.create(regData).then(function (data) {
      if (data.data.success) {

        $scope.successMsg = data.data.message + '...Redirecting';
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
        $scope.loading = false;
        $timeout(function () {
          $location.path('/');
        }, 2000)
      } else {
        $scope.errorMsg = data.data.message;
        toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
        $scope.loading = false;
      }
    })
  }
  $scope.checkUsername = function (regData) {
    User.checkUsername($scope.regData).then(function (data) {
      if (data.data.success) {
        $scope.validUserName = data.data.message;
      } else {
        $scope.validUserName = data.data.message;
      }
    })
  }
  $scope.checkEmail = function (regData) {
    User.checkEmail($scope.regData).then(function (data) {
      //console.log(data.data.message)
      if (data.data.success) {
        $scope.validEmail = data.data.message;
      } else {
        $scope.validEmail = data.data.message;
      }
    })
  }
}])

app.controller('loginCtrl', function ($scope, Auth, $timeout, $location, $rootScope, $window, $interval, User, AuthToken, toaster, anchorSmoothScroll, toaster, $http) {
  $http.get('/blog/blog').then(function (response) {
    //console.log("I got the data that I requested");
    $scope.posts = response.data
    //console.log($scope.posts[0]._id);
    $scope.post = '';
  });

  $scope.gotoElement = function (eID) {
    // set the location.hash to the id of
    // the element you wish to scroll to.
    $location.hash('bottom');

    // call $anchorScroll()
    anchorSmoothScroll.scrollTo(eID);

  };
  //this is for signup and signin page
  $scope.class = "";

  $scope.addClass = function () {
    $scope.class = "s--signup";
  }
  $scope.removeClass = function () {
    $scope.class = "";
  }
  $scope.changeClass = function () {
    if ($scope.class === "")
      $scope.class = "s--signup";
    else
      $scope.class = "";
  };

  $scope.togglePassword = function () {
    $scope.typePassword = !$scope.typePassword;
    $scope.viewPassword = !$scope.viewPassword;
  };
  $scope.loadme = false;
  if ($window.location.pathname === '/') app.home = true;
  if (Auth.isLoggedIn()) {
    // Check if a the token expired
    Auth.getUser().then(function (data) {
      // Check if the returned user is undefined (expired)
      if (data.data.username === undefined) {
        Auth.logout(); // Log the user out
        app.isLoggedIn = false; // Set session to false
        $location.path('/'); // Redirect to home page
        app.loadme = true; // Allow loading of page
      }
    });
  }
  // Function to run an interval that checks if the user's token has expired
  $scope.checkSession = function () {
    // Only run check if user is logged in
    if (Auth.isLoggedIn()) {
      $scope.checkingSession = true; // Use variable to keep track if the interval is already running
      // Run interval ever 30000 milliseconds (30 seconds) 
      var interval = $interval(function () {
        var token = $window.localStorage.getItem('token'); // Retrieve the user's token from the client local storage
        // Ensure token is not null (will normally not occur if interval and token expiration is setup properly)
        if (token === null) {
          $interval.cancel(interval); // Cancel interval if token is null
        } else {
          // Parse JSON Web Token using AngularJS for timestamp conversion
          self.parseJwt = function (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
          };
          var expireTime = self.parseJwt(token); // Save parsed token into variable
          var timeStamp = Math.floor(Date.now() / 1000); // Get current datetime timestamp
          var timeCheck = expireTime.exp - timeStamp; // Subtract to get remaining time of token
          // Check if token has less than 30 minutes till expiration
          if (timeCheck <= 1800) {
            showModal(1); // Open bootstrap modal and let user decide what to do
            $interval.cancel(interval); // Stop interval
          }
        }
      }, 30000);
    }
  };

  $scope.checkSession(); // Ensure check is ran check, even if user refreshes

  // Function to open bootstrap modal     
  var showModal = function (option) {
    $scope.choiceMade = false; // Clear choiceMade on startup
    $scope.modalHeader = undefined; // Clear modalHeader on startup
    $scope.modalBody = undefined; // Clear modalBody on startup
    $scope.hideButton = false; // Clear hideButton on startup

    // Check which modal option to activate (option 1: session expired or about to expire; option 2: log the user out)      
    if (option === 1) {
      $scope.modalHeader = 'Timeout Warning'; // Set header
      $scope.modalBody = 'Your session will expired in 30 minutes. Would you like to renew your session?'; // Set body
      $("#myModal").modal({ backdrop: "static" }); // Open modal
      // Give user 10 seconds to make a decision 'yes'/'no'
      $timeout(function () {
        if (!$scope.choiceMade) $scope.endSession(); // If no choice is made after 10 seconds, select 'no' for them
      }, 10000);
    } else if (option === 2) {
      $scope.hideButton = true; // Hide 'yes'/'no' buttons
      $scope.modalHeader = 'Logging Out'; // Set header
      $("#myModal").modal({ backdrop: "static" }); // Open modal
      // After 1000 milliseconds (2 seconds), hide modal and log user out
      $timeout(function () {
        Auth.logout(); // Logout user
        $location.path('/'); // Change route to clear user object
        hideModal(); // Close modal
        $window.location.reload();
      }, 2000);
    }

  };

  // Function that allows user to renew their token to stay logged in (activated when user presses 'yes')
  $scope.renewSession = function () {
    $scope.choiceMade = true; // Set to true to stop 10-second check in option 1
    // Function to retrieve a new token for the user
    User.renewSession($scope.username).then(function (data) {
      // Check if token was obtained
      if (data.data.success) {
        AuthToken.setToken(data.data.token); // Re-set token
        $scope.checkSession(); // Re-initiate session checking
      } else {
        $scope.modalBody = data.data.message; // Set error message
      }
    });
    hideModal(); // Close modal
  };

  // Function to expire session and logout (activated when user presses 'no)
  $scope.endSession = function () {
    $scope.choiceMade = true; // Set to true to stop 10-second check in option 1
    hideModal(); // Hide modal
    // After 1 second, activate modal option 2 (log out)
    $timeout(function () {
      showModal(2); // logout user
    }, 1000);
  };

  // Function to hide the modal
  var hideModal = function () {
    $("#myModal").modal('hide'); // Hide modal once criteria met
  };

  // Check if user is on the home page
  $rootScope.$on('$routeChangeSuccess', function () {
    if ($window.location.pathname === '/') {
      $scope.home = true; // Set home page div
    } else {
      $scope.home = false; // Clear home page div
    }
  });


  $rootScope.$on('$routeChangeStart', function () {
    if (!$scope.checkingSession) $scope.checkSession();
    //$rootScope.isLoggedIn = false;
    if (Auth.isLoggedIn()) {
      Auth.getUser().then(function (data) {
        if (data.data.username === undefined) {
          $scope.isLoggedIn = false; // Variable to deactivate ng-show on index
          Auth.logout();
          $scope.isLoggedIn = false;
          $location.path('/');
        } else {
          $scope.isLoggedIn = true;
          checkLoginStatus = data.data.username;
          $scope.username = data.data.username;
          $scope.name = data.data.name;
          $scope.phone = data.data.phone;
          $scope.email = data.data.email;
          $scope.id = data.data.id;
          $scope.userImage = data.data.userImage;

          User.getPermission().then(function (data) {
            if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
              $scope.authorized = true;
              $scope.loadme = true;
            } else {
              $scope.authorized = false;
              $scope.loadme = true;
            }
          });
        }
      });
    } else {
      $scope.username = '';
      $scope.email = '';
      $scope.name = '';
      $scope.phone = '';
      $scope.id = '';
      $scope.userImage = '';
      $scope.isLoggedIn = false;
      $scope.loadme = true
    }
  })

  $scope.loginUser = function (loginData) {
    $scope.errorMsg = false;
    $scope.loading = true;
    $scope.expired = false;
    $scope.disabled = true;
    Auth.login(loginData).then(function (data) {
      if (data.data.success) {
        $scope.successMsg = data.data.message + '...Redirecting';
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
        $scope.loading = false;
        $timeout(function () {
          $location.path('/postsAdminPage')
          $scope.loginData = '';
          $scope.successMsg = false;
          $scope.disabled = false;
          $scope.checkSession();
        }, 2000)
      } else {
        if (data.data.expired) {
          $scope.expired = true;
          $scope.errorMsg = data.data.message;
          toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
          $scope.loading = false;
        } else {

          $scope.errorMsg = data.data.message;
          toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
          $scope.loading = false;
          $scope.disabled = false;
        }
      }
    });
  }
  $scope.logout = function () {
    showModal(2); // Activate modal that logs out user
  }
});

app.controller('emailCtrl', function ($scope, $routeParams, User, $timeout, $location, toaster) {
  //console.log($routeParams.token)
  User.activateAccount($routeParams.token).then(function (data) {
    $scope.successMsg = false;
    $scope.errorMsg = false;
    if (data.data.success) {
      $scope.successMsg = data.data.message +" "+"...Redirecting";
      toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      $timeout(function () {
        $location.path('/login')
      }, 2000)
    } else {
      $scope.errorMsg = data.data.message +" "+"...Redirecting";
      toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
      $timeout(function () {
        $location.path('/login')
      }, 2000)
    }
  })
})

app.controller('resendCtrl', function ($scope, User, toaster) {
  $scope.checkCredentials = function (loginData) {
    $scope.errorMsg = false;
    $scope.successMsg = false;
    $scope.disabled = false;
    User.checkCredentials($scope.loginData).then(function (data) {
      //console.log(data)
      if (data.data.success) {
        User.resendLink($scope.loginData).then(function (data) {
          //console.log(data);
          $scope.successMsg = data.data.message;
          toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
          $scope.disabled = true;
        })
      } else {
        $scope.errorMsg = data.data.message;
        toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
        $scope.disabled = false;
      }
    })
  }
})

app.controller('usernameCtrl', function ($scope, User, toaster) {
  $scope.sendUsername = function (userData) {
    $scope.errorMsg = false;
    $scope.successMsg = false;
    User.sendUsername($scope.userData.email).then(function (data) {
      if (data.data.success) {
        $scope.successMsg = data.data.message;
        toaster.success({ title: "Error", body: $scope.successMsg }, 10000);
      } else {
        $scope.errorMsg = data.data.message;
        toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
      }
    })
  }
})
app.controller('passwordCtrl', function ($scope, User, toaster) {

  //User.sendPassword(resetData);
  $scope.sendPassword = function (resetData) {
    $scope.errorMsg = false;
    $scope.successMsg = false;
    User.sendPassword($scope.resetData).then(function (data) {
      if (data.data.success) {
        $scope.successMsg = data.data.message;
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      } else {
        $scope.errorMsg = data.data.message;
        toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
      }
    })
  }
})

app.controller('resetCtrl', function ($routeParams, $scope, User, toaster, $timeout, $location) {
  $scope.hide = true;
  User.resetUser($routeParams.token).then(function (data) {
    if (data.data.success) {
      $scope.hide = false;
      $scope.successMsg = "please enter a new password";
      $scope.username = data.data.user.username;
      // console.log($scope.username)
    } else {
      $scope.errorMsg = data.data.message;
      toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
    }
  });
  $scope.savePassword = function (regData, valid, confirmed) {
    $scope.errorMsg = false;
    $scope.disabled = true;
    $scope.loading = true;

    if (valid && confirmed) {
      $scope.regData.username = $scope.username;
      User.savePassword($scope.regData).then(function (data) {
        $scope.loading = false;
        if (data.data.success) {
          $scope.successMsg = data.data.message +" "+"...Redirecting";
          toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
          $timeout(function () {
            $location.path('/login')
          }, 2000)
        } else {
          $scope.errorMsg = data.data.message;
          toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
        }
      });
    } else {
      $scope.disabled = false;
      $scope.successMsg = false;
      $scope.loading = false;
      $scope.errorMsg = "Please ensure form is filled out properly"
    }
  }
})

app.controller('editProfileCtrl', function ($scope, $routeParams, User, toaster, $timeout, $http, $location) {


  // start Picture Preview    
  $scope.imageUpload = function (event) {
    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var reader = new FileReader();
      reader.onload = $scope.imageIsLoaded;
      reader.readAsDataURL(file);
    }
  }

  $scope.imageIsLoaded = function (e) {
    $scope.$apply(function () {
      $scope.img = e.target.result;
    });
  }
  $http.get("/user/editProfile/" + $routeParams.id).then(function (response) {
    $scope.user = response.data.user;
    console.log($scope.user)
  });
  $scope.user = {};
  $scope.profileUpdate = function () {
    //debugger
    var formData = new FormData;

    for (key in $scope.user) {
      formData.append(key, $scope.user[key]);
    }

    var file = $("#userImage")[0].files[0];
    if (file == undefined) {
      //return false;
      $http.put('/user/editProfile/' + $scope.user._id, $scope.user).then(function (response) {
        $scope.successMsg = response.data.message;
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      })
    }
    formData.append('userImage', file);
    $http.put('/user/editProfile/' + $scope.user._id, formData, {
      transformRequest: angular.identity,
      headers: {
        'content-Type': undefined
      }
    }).then(function (response) {
      $scope.successMsg = response.data.message;
      toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      console.log(response)
    })
  }



  // Function: Update the user's name
  $scope.updateProfile = function (newName, newPhone, profileImage) {

    var file = $("#profileImage")[0].files[0];
    $scope.fileName = file;
    console.log(newName)
    $scope.errorMsg = false; // Clear any error messages
    // $scope.disabled = true; // Disable form while processing
    // Check if the name being submitted is valid
    var userObject = {}; // Create a user object to pass to function
    userObject._id = $scope.currentUser; // Get _id to search database
    userObject.name = $scope.newName; // Set the new name to the user
    userObject.phone = $scope.newPhone; // Set the new Phone number to the user
    userObject.profileImage = $scope.fileName;
    console.log(userObject.profileImage)
    // Runs function to update the user's name
    User.editUserProfile(userObject).then(function (data) {
      // Check if able to edit the user's name
      if (data.data.success) {
        $scope.successMsg = data.data.message; // Set success message
        toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
      } else {
        $scope.errorMsg = data.data.message; // Clear any error messages
        //$scope.disabled = false; // Enable form for editing
        toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
      }
    });
  };
});

app.directive('errSrc', function () {
  return {
    link: function (scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });

      attrs.$observe('ngSrc', function (value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
app.filter('strLimit', ['$filter', function ($filter) {
  return function (input, limit) {
    if (!input) return;
    if (input.length <= limit) {
      return input;
    }

    return $filter('limitTo')(input, limit) + '...';
  };
}]);

app.filter('replace', [function () {
  return function (input, from, to) {
    if (input === undefined) {
      return;
    }
    var regex = new RegExp(from, 'g');
    return input.replace(regex, to);
  };
}]);

app.directive('match', function () {
  return {
    restrict: 'A',
    controller: function ($scope) {
      $scope.confirmed = false;
      $scope.doConfirm = function (values) {
        values.forEach(function (ele) {
          if ($scope.confirm == ele) {
            $scope.confirmed = true;
          } else {
            $scope.confirmed = false;
          }
        })
      }
    },
    link: function (scope, element, attrs) {

      attrs.$observe('match', function () {
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      });
      scope.$watch('confirm', function () {
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      })
    }
  };
});

app.service('anchorSmoothScroll', function () {

  this.scrollTo = function (eID) {

    // This scrolling function 
    // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
      for (var i = startY; i < stopY; i += step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY += step; if (leapY > stopY) leapY = stopY; timer++;
      } return;
    }
    for (var i = startY; i > stopY; i -= step) {
      setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
      leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }

    function currentYPosition() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) return self.pageYOffset;
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) return document.body.scrollTop;
      return 0;
    }

    function elmYPosition(eID) {
      var elm = document.getElementById(eID);
      var y = elm.offsetTop;
      var node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
      } return y;
    }

  };

});
