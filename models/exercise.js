var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ExerciseSchema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        description: {type: String, required: true},
        duration: {type: Number, required: true},
        date: {type: Date}
    }
);

module.exports = mongoose.model('Exercise', ExerciseSchema);