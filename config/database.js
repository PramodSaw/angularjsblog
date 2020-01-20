const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports = {
    //uri: 'mongodb://localhost:27017/mean-stack',
	uri: 'mongodb+srv://Test:Test@123@cluster0-nb5lj.mongodb.net/angularjsblogs?retryWrites=true&w=majority',
    secret: crypto,
    db: 'mean-stack'
}