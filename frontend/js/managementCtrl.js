// Controller: User to control the management page and managing of user accounts
app.controller('managementCtrl', function(User, $scope, toaster) {

    $scope.loading = true; // Start loading icon on page load
    $scope.accessDenied = true; // Hide table while loading
    $scope.errorMsg = false; // Clear any error messages
    $scope.editAccess = false; // Clear access on load
    $scope.deleteAccess = false; // CLear access on load
    $scope.limit = 5; // Set a default limit to ng-repeat
    $scope.searchLimit = 0; // Set the default search page results limit to zero

    // Function: get all the users from database
    function getUsers() {
        // Runs function to get all the users from database
        User.getUsers().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                    $scope.users = data.data.users; // Assign users from database to variable
                    $scope.loading = false; // Stop loading icon
                    $scope.accessDenied = false; // Show table
                    // Check if logged in user is an admin or moderator
                    if (data.data.permission === 'admin') {
                        $scope.editAccess = true; // Show edit button
                        $scope.deleteAccess = true; // Show delete button
                    } else if (data.data.permission === 'moderator') {
                        $scope.editAccess = true; // Show edit button
                    }
                } else {
                    $scope.errorMsg = 'Insufficient Permissions'; // Reject edit and delete options
                    toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
                    $scope.loading = false; // Stop loading icon
                }
            } else {
                $scope.errorMsg = data.data.message; // Set error message
                toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
                $scope.loading = false; // Stop loading icon
            }
        });
    }

    getUsers(); // Invoke function to get users from databases

    // Function: Show more results on page
    $scope.showMore = function(number) {
        $scope.showMoreError = false; // Clear error message
        // Run functio only if a valid number above zero
        if (number > 0) {
            $scope.limit = number; // Change ng-repeat filter to number requested by user
        } else {
            $scope.showMoreError = 'Please enter a valid number'; // Return error if number not valid
            toaster.error({ title: "Error", body: $scope.showMoreError }, 10000);
        }
    };

    // Function: Show all results on page
    $scope.showAll = function() {
        $scope.limit = undefined; // Clear ng-repeat limit
        $scope.showMoreError = false; // Clear error message
    };

    // Function: Delete a user
    $scope.deleteUser = function(username) {
        // Run function to delete a user
        User.deleteUser(username).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getUsers(); // Reset users on page
            } else {
                $scope.showMoreError = data.data.message; // Set error message
                toaster.error({ title: "Error", body: $scope.showMoreError }, 10000);
            }
        });
    };

    // Function: Perform a basic search function
    $scope.search = function(searchKeyword, number) {
        // Check if a search keyword was provided
        if (searchKeyword) {
            // Check if the search keyword actually exists
            if (searchKeyword.length > 0) {
                $scope.limit = 0; // Reset the limit number while processing
                $scope.searchFilter = searchKeyword; // Set the search filter to the word provided by the user
                $scope.limit = number; // Set the number displayed to the number entered by the user
            } else {
                $scope.searchFilter = undefined; // Remove any keywords from filter
                $scope.limit = 0; // Reset search limit
            }
        } else {
            $scope.searchFilter = undefined; // Reset search limit
            $scope.limit = 0; // Set search limit to zero
        }
    };

    // Function: Clear all fields
    $scope.clear = function() {
        $scope.number = 'Clear'; // Set the filter box to 'Clear'
        $scope.limit = 0; // Clear all results
        $scope.searchKeyword = undefined; // Clear the search word
        $scope.searchFilter = undefined; // Clear the search filter
        $scope.showMoreError = false; // Clear any errors
    };

    // Function: Perform an advanced, criteria-based search
    $scope.advancedSearch = function(searchByUsername, searchByEmail, searchByName) {
        // Ensure only to perform advanced search if one of the fields was submitted
        if (searchByUsername || searchByEmail || searchByName) {
            $scope.advancedSearchFilter = {}; // Create the filter object
            if (searchByUsername) {
                $scope.advancedSearchFilter.username = searchByUsername; // If username keyword was provided, search by username
            }
            if (searchByEmail) {
                $scope.advancedSearchFilter.email = searchByEmail; // If email keyword was provided, search by email
            }
            if (searchByName) {
                $scope.advancedSearchFilter.name = searchByName; // If name keyword was provided, search by name
            }
            $scope.searchLimit = undefined; // Clear limit on search results
        }
    };

    // Function: Set sort order of results
    $scope.sortOrder = function(order) {
        $scope.sort = order; // Assign sort order variable requested by user
    };
})

// Controller: Used to edit users
app.controller('editUserCtrl', function($scope, $routeParams, User, $timeout, toaster) {
    
    //var $scope = this;
    $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
    $scope.phase1 = true; // Set the 'name' tab to default view

    // Function: get the user that needs to be edited
    User.getUser($routeParams.id).then(function(data) {
        // Check if the user's _id was found in database
        if (data.data.success) {
            $scope.newName = data.data.user.name; // Display user's name in scope
            $scope.newEmail = data.data.user.email; // Display user's e-mail in scope
            $scope.newUsername = data.data.user.username; // Display user's username in scope
            $scope.newPermission = data.data.user.permission; // Display user's permission in scope
            $scope.currentUser = data.data.user._id; // Get user's _id for update functions
        } else {
            $scope.errorMsg = data.data.message; // Set error message
            $scope.alert = 'alert alert-danger'; // Set class for message
        }
    });

    // Function: Set the name pill to active
    $scope.namePhase = function() {
        $scope.nameTab = 'active'; // Set name list to active
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'default'; // Clear email class
        $scope.permissionsTab = 'default'; // Clear permission class
        $scope.phase1 = true; // Set name tab active
        $scope.phase2 = false; // Set username tab inactive
        $scope.phase3 = false; // Set e-mail tab inactive
        $scope.phase4 = false; // Set permission tab inactive
        $scope.errorMsg = false; // Clear error message
    };

    // Function: Set the e-mail pill to active
    $scope.emailPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'active'; // Set e-mail list to active
        $scope.permissionsTab = 'default'; // Clear permissions class
        $scope.phase1 = false; // Set name tab to inactive
        $scope.phase2 = false; // Set username tab to inactive
        $scope.phase3 = true; // Set e-mail tab to active
        $scope.phase4 = false; // Set permission tab to inactive
        $scope.errorMsg = false; // Clear error message
    };

    // Function: Set the username pill to active
    $scope.usernamePhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'active'; // Set username list to active
        $scope.emailTab = 'default'; // CLear e-mail class
        $scope.permissionsTab = 'default'; // CLear permissions tab
        $scope.phase1 = false; // Set name tab to inactive
        $scope.phase2 = true; // Set username tab to active
        $scope.phase3 = false; // Set e-mail tab to inactive
        $scope.phase4 = false; // Set permission tab to inactive
        $scope.errorMsg = false; // CLear error message
    };

    // Function: Set the permission pill to active
    $scope.permissionsPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'default'; // Clear e-mail class
        $scope.permissionsTab = 'active'; // Set permission list to active
        $scope.phase1 = false; // Set name tab to inactive
        $scope.phase2 = false; // Set username to inactive
        $scope.phase3 = false; // Set e-mail tab to inactive
        $scope.phase4 = true; // Set permission tab to active
        $scope.disableUser = false; // Disable buttons while processing
        $scope.disableModerator = false; // Disable buttons while processing
        $scope.disableAdmin = false; // Disable buttons while processing
        $scope.errorMsg = false; // Clear any error messages
        // Check which permission was set and disable that button
        if ($scope.newPermission === 'user') {
            $scope.disableUser = true; // Disable 'user' button
        } else if ($scope.newPermission === 'moderator') {
            $scope.disableModerator = true; // Disable 'moderator' button
        } else if ($scope.newPermission === 'admin') {
            $scope.disableAdmin = true; // Disable 'admin' button
        }
    };

    // Function: Update the user's name
    $scope.updateName = function(newName, valid) {
        $scope.errorMsg = false; // Clear any error messages
        $scope.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
        if (valid) {
            var userObject = {}; // Create a user object to pass to function
            userObject._id = $scope.currentUser; // Get _id to search database
            userObject.name = $scope.newName; // Set the new name to the user
            // Runs function to update the user's name
            User.editUser(userObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    $scope.successMsg = data.data.message; // Set success message
                    toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        $scope.nameForm.name.$setPristine(); // Reset name form
                        $scope.nameForm.name.$setUntouched(); // Reset name form
                        $scope.successMsg = false; // Clear success message
                        $scope.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    $scope.errorMsg = data.data.message; // Clear any error messages
                    toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
                    $scope.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.alert = 'alert alert-danger'; // Set class for message
            $scope.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            $scope.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's e-mail
    $scope.updateEmail = function(newEmail, valid) {
        $scope.errorMsg = false; // Clear any error messages
        $scope.disabled = true; // Lock form while processing
        // Check if submitted e-mail is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass in function
            userObject._id = $scope.currentUser; // Get the user's _id in order to edit
            userObject.email = $scope.newEmail; // Pass the new e-mail to save to user in database
            // Run function to update the user's e-mail
            User.editUser(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    $scope.successMsg = data.data.message; // Set success message
                    toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        $scope.emailForm.email.$setPristine(); // Reset e-mail form
                        $scope.emailForm.email.$setUntouched(); // Reset e-mail form
                        $scope.successMsg = false; // Clear success message
                        $scope.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    $scope.errorMsg = data.data.message; // Set error message
                    toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
                    $scope.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.alert = 'alert alert-danger'; // Set class for message
            $scope.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            $scope.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's username
    $scope.updateUsername = function(newUsername, valid) {
        $scope.errorMsg = false; // Clear any error message
        $scope.disabled = true; // Lock form while processing
        // Check if username submitted is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass to function
            userObject._id = $scope.currentUser; // Pass current user _id in order to edit
            userObject.username = $scope.newUsername; // Set the new username provided
            // Runs function to update the user's username
            User.editUser(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    $scope.successMsg = data.data.message; // Set success message
                    toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        $scope.usernameForm.username.$setPristine(); // Reset username form
                        $scope.usernameForm.username.$setUntouched(); // Reset username form
                        $scope.successMsg = false; // Clear success message
                        $scope.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.errorMsg = data.data.message; // Set error message
                    toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
                    $scope.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            $scope.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's permission
    $scope.updatePermissions = function(newPermission) {
        $scope.errorMsg = false; // Clear any error messages
        $scope.disableUser = true; // Disable button while processing
        $scope.disableModerator = true; // Disable button while processing
        $scope.disableAdmin = true; // Disable button while processing
        var userObject = {}; // Create the user object to pass to function
        userObject._id = $scope.currentUser; // Get the user _id in order to edit
        userObject.permission = newPermission; // Set the new permission to the user
        // Runs function to udate the user's permission
        User.editUser(userObject).then(function(data) {
            // Check if was able to edit user
            if (data.data.success) {
                $scope.alert = 'alert alert-success'; // Set class for message
                $scope.successMsg = data.data.message; // Set success message
                toaster.success({ title: "Success", body: $scope.successMsg }, 10000);
                // Function: After two seconds, clear and re-enable
                $timeout(function() {
                    $scope.successMsg = false; // Set success message
                    $scope.newPermission = newPermission; // Set the current permission variable
                    // Check which permission was assigned to the user
                    if (newPermission === 'user') {
                        $scope.disableUser = true; // Lock the 'user' button
                        $scope.disableModerator = false; // Unlock the 'moderator' button
                        $scope.disableAdmin = false; // Unlock the 'admin' button
                    } else if (newPermission === 'moderator') {
                        $scope.disableModerator = true; // Lock the 'moderator' button
                        $scope.disableUser = false; // Unlock the 'user' button
                        $scope.disableAdmin = false; // Unlock the 'admin' button
                    } else if (newPermission === 'admin') {
                        $scope.disableAdmin = true; // Lock the 'admin' buton
                        $scope.disableModerator = false; // Unlock the 'moderator' button
                        $scope.disableUser = false; // unlock the 'user' button
                    }
                }, 2000);
            } else {
                $scope.alert = 'alert alert-danger'; // Set class for message
                $scope.errorMsg = data.data.message; // Set error message
                toaster.error({ title: "Error", body: $scope.errorMsg }, 10000);
                $scope.disabled = false; // Enable form for editing
            }
        });
    };
});