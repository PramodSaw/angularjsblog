const crypto = require('crypto').randomBytes(256).toString('hex');
module.exports = {
    //uri: 'mongodb://localhost:27017/mean-stack',
    //uri: 'mongodb+srv://Test:Test@123@cluster0-nb5lj.mongodb.net/angularjsblogs?retryWrites=true&w=majority',
   // uri: 'mongodb+srv://Test:Test:Test@123@cluster0-nb5lj.mongodb.net/angularjsblogs',
    uri: 'mongodb+srv://Test:D3TwtIE2TTa11Yob@cluster0.nb5lj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    //uri: 'mongodb://root:password@ds027215.mlab.com:27215/gugui3z24',
    secret: crypto,
    //db: 'mean-stack'
}
