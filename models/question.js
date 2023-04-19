const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  answers: [
    {
      type: String,
      required: true
    }
  ],
  correctAnswerIndexes: [
    {
      type: Number,
      min: 0
    }
  ]
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;