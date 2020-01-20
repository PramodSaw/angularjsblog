angular.module('authServices', [])

.factory('Auth', function($http, AuthToken){
    var authFactory = {};

    //Auth.create(loginData)
    authFactory.login = function(loginData){
        return $http.post('/user/authenticate', loginData).then(function(data){
            AuthToken.setToken(data.data.token)
            return data;
        })
    }
    //Auth.isLoggedIn()
    authFactory.isLoggedIn = function(){
        if(AuthToken.getToken()){
            return true;
        }else{
            return false;
        }
    }

    //Auth.getUser()
    authFactory.getUser = function(){
        if(AuthToken.getToken()){
            return $http.post('/user/me')
        }else{
            $q.reject({message: 'User has no token'});
        }
    }
    authFactory.getUser = function(){
        if(AuthToken.getToken()){
            return $http.post('/blog/me')
        }else{
            $q.reject({message: 'User has no token'});
        }
    }

    //Auth.logout()
    authFactory.logout= function(){
        AuthToken.setToken();
    };
    return authFactory;
})
.factory('AuthToken', function($window){
    var authTokenFactory = {};

    //authTokenFactory.setToken(token)
    authTokenFactory.setToken = function(token){
        if(token){
            $window.localStorage.setItem('token', token)
        }else{
            $window.localStorage.removeItem('token');
        }
    }
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token')
    }
    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken){
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken();
        if(token) config.headers['x-access-token'] =token;

        return config;
    }

    return authInterceptorsFactory;
})