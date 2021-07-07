const cors = require('cors');

const whiteList = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if (whiteList.indexOf(req.header('origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();//allow all
exports.corsWithOptions = cors(corsOptionsDelegate);// check whitelist