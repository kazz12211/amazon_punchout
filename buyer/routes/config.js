const config = {
    db: {
        url: 'mongodb://172.17.0.2:27017/buyer',
        options: {
            useNewUrlParser: true,
            reconnectTries: 60,
            reconnectInterval: 1000
        }
    }
};

module.exports = config;
