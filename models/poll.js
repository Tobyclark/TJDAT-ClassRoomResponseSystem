const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    }
  ]
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;