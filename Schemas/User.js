const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoose_delete = require('mongoose-delete');
const bcrypt = require('bcrypt');

function GenID(length) {
    var result = "";
    var source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789"
    for (let index = 0; index < length; index++) {
      var random = Math.floor(Math.random() * source.length);
      result += source[random];
    }
    return result;
  }
  

const User = new Schema({
    id: { type: Number, unique: true, default: 0},
    name: { type: String, required: true, default: ""},
    username: { type: String, required: true, default: "", unique: true},
    email: { type: String, required: true, default: "", unique: true, lowercase: true},
    password: { type: String, required: true, default: ""},
    address: { type: String, default: ""},
    phone: { type: String, required: true, default: "", unique: true, maxLength: 10},
    gender: { type: String, default: "unknown"},
    age: { type: Number, default: 0},
    bio: { type: String, default: "this user has no bio yet"},
    image: { type: String, default: "https://e7.pngegg.com/pngimages/867/694/png-clipart-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue-text-thumbnail.png"},
    role: { type: String, default: "user", uppercase: true}
}, { timestamps: true })

User.pre('save', async function(next){
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    } catch (error) {
        next(error);
    }
})

User.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('User', User);