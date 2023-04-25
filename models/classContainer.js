const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classContainerSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  students: [
    {
      type: String,
      required: true
    }
  ],
  polls: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Poll',
      required: true
    }
  ]
});

const ClassContainer = mongoose.model('ClassContainer', classContainerSchema);

module.exports = ClassContainer;