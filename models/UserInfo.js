const mongoose = require('mongoose');

// Schema holds an ID for the list of UserInfo
const UserInfoSchemma = new mongoose.Schema({
    _mapId: {
        type: mongoose.Types.ObjectId,
        default: {},
        required: true
    }
});

const UserInfo = mongoose.model('UserInfo', UserInfoSchemma);
module.exports = UserInfo;
