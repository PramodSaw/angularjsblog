// Include app dependency on ngMaterial
var app = angular.module('meanStack', ['ngMessages', 'ngRoute', 'angularFileUpload', 'ngSanitize', 'userServices', 'authServices', 'toaster', 'ngAnimate', 'angular.filter'])
app.config(['$routeProvider', '$httpProvider',  function($routeProvider, $httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeCtrl'
    })
    .when('/post', {
        templateUrl: 'pages/post.html',
        controller: 'postCtrl',
        authenticated: true
    })
    .when('/postsAdminPage', {
        templateUrl: 'pages/postsAdmin.html',
        controller: 'homeCtrl',
        authenticated: true
    })
    .when('/categories/:categories', {
        templateUrl: 'pages/categories.html',
        controller: 'homeCtrl'
    })
    .when('/login', {
        templateUrl: 'pages/register.html',
        controller: 'userCtrl',
        authenticated: false
    })
    // .when('/login', {
    //     templateUrl: 'pages/login.html',
    //     authenticated: false
    // })
    .when('/activate/:token', {
        templateUrl: 'pages/activate.html',
        controller: 'emailCtrl',
        authenticated: false
    })
    .when('/resend', {
        templateUrl: 'pages/resend.html',
        controller: 'resendCtrl',
        authenticated: false
    })
    .when('/resetusername', {
        templateUrl: 'pages/username.html',
        controller: 'usernameCtrl',
        authenticated: false
    })
    .when('/resetpassword', {
        templateUrl: 'pages/password.html',
        controller: 'passwordCtrl',
        authenticated: false
    })
    .when('/reset/:token', {
        templateUrl: 'pages/newpassword.html',
        controller: 'resetCtrl',
        authenticated: false
    })
    .when('/management', {
        templateUrl: 'pages/management.html',
        controller: 'managementCtrl',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    .when('/edituser/:id', {
        templateUrl: 'pages/edituser.html',
        controller: 'editUserCtrl',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    .when('/profile/:id', {
        templateUrl: 'pages/profile.html',
        controller: 'editProfileCtrl',
        authenticated: true,
    })
    .when('/search', {
        templateUrl: 'pages/search.html',
        controller: 'managementCtrl',
        authenticated: true,
        permission: ['admin', 'moderator']
    })
    // .when('/profile', {
    //     templateUrl: 'pages/profile.html',
    //     authenticated: true
    // })
    .when('/edit/:postHead', {
        templateUrl: 'pages/edit.html',
        controller: 'editCtrl',
        authenticated: true
    })
    .when('/:postHead', {
        templateUrl: 'pages/blog.html',
        controller: 'editCtrl'
    })
    
    .otherwise({ redirectTo: '/'});
    
}])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
})


app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/')
            }else if (next.$$route.permission){
                User.getPermission().then(function(data) {
                    if(next.$$route.permission[0] !== data.data.permission){
                        if(next.$$route.permission[1] !== data.data.permission){
                            event.preventDefault();
                            $location.path('/')
                        }
                    }
                })
            }
        }else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/profile')
            }
        }
    })
}]);

