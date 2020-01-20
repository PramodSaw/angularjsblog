angular.module('userServices', [])

.factory('User', function($http){
    userFactory ={};

    //user.create(regData)
    userFactory.create = function(regData){
        return $http.post('/user/users', regData)
    }

    //User.checkUsername(regData)
    userFactory.checkUsername = function(regData){
        return $http.post('/user/checkusername', regData)
    }
    //User.checkUsername(regData)
    userFactory.checkEmail = function(regData){
        return $http.post('/user/checkemail', regData)
    }
    //User.activateAccount(token);
    userFactory.activateAccount = function(token) {
        return $http.put('/user/activate/' + token);
    };

    //User.checkCredentials(loginData)
    userFactory.checkCredentials = function(loginData) {
        return $http.post('/user/resend', loginData);
    };
    
    // User.resendLink(username);
    userFactory.resendLink = function(username) {
        return $http.put('/user/resend', username);
    };

    // User.sendUsername(userData);
    userFactory.sendUsername = function(userData){
        return $http.get('/user/resetusername/'+ userData)
    }

    // User.sendPassword(resetData);
    userFactory.sendPassword = function(resetData) {
        return $http.put('/user/resetpassword', resetData);
    };

    // User.resetUser(token);
    userFactory.resetUser = function(token) {
        return $http.get('/user/resetpassword/' + token);
    };

    // User.savePassword(regData);
    userFactory.savePassword = function(regData) {
        return $http.put('/user/savepassword', regData);
    };

    // User.renewSession(username);
    userFactory.renewSession = function(username) {
        return $http.get('/user/renewToken/' + username);
    };

    // User.getPermission();
    userFactory.getPermission = function() {
        return $http.get('/user/permission' );
    };

    // Get all the users from database
    userFactory.getUsers = function() {
        return $http.get('/user/management/');
    };

    // Get user to then edit
    userFactory.getUser = function(id) {
        return $http.get('/user/edit/' + id);
    };

    userFactory.gatUserProfile = function(id){
        return $http.get('/user/editProfile/' + id)
    }

    // Delete a user
    userFactory.deleteUser = function(username) {
        return $http.delete('/user/management/' + username);
    };

    // Edit a user
    userFactory.editUser = function(id) {
        return $http.put('/user/edit', id);
    };

    userFactory.editUserProfile = function(id) {
        return $http.put('/user/editProfile', id);
    };

    // Function to like a blog post
  userFactory.likeBlog = function(id) {
    const blogData = { id: id };
    return $http.put('/blog/likeBlog', blogData);
  }

  // Function to dislike a blog post
  userFactory.dislikeBlog = function(id) {
    const blogData = { id: id };
    return $http.put('/blog/dislikeBlog', blogData);
  }

    return userFactory;
})