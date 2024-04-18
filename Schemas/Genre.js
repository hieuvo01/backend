const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoose_delete = require('mongoose-delete');

const Genre = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true, default: ""}
})

Genre.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true })
module.exports = mongoose.model("Genre", Genre);