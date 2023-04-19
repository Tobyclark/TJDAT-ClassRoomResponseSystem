const express = require('express');
const router = express.Router();
const ClassContainer = require('../models/classContainer');
const Poll = require('../models/poll');
const Question = require('../models/question');

// Add a new class container
router.post('/classes', async (req, res) => {
  try {
    const { teacherName } = req.body;
    const classContainer = new ClassContainer({ teacher: teacherName });
    await classContainer.save();
    res.status(201).json(classContainer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new student to a class container
router.post('/classes/:classId/students', async (req, res) => {
  try {
    const { studentName } = req.body;
    const classContainer = await ClassContainer.findById(req.params.classId);
    classContainer.addStudent(studentName);
    await classContainer.save();
    res.status(200).json(classContainer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new poll to a class container
router.post('/classes/:classId/polls', async (req, res) => {
  try {
    const classContainer = await ClassContainer.findById(req.params.classId);
    const poll = new Poll();
    await poll.save();
    classContainer.addPoll(poll);
    await classContainer.save();
    res.status(200).json(classContainer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new question to a poll
router.post('/polls/:pollId/questions', async (req, res) => {
  try {
    const { text, answers, correctAnswerIndexes } = req.body;
    const question = new Question({ text });
    for (let i = 0; i < answers.length; i++) {
      question.addAnswer(answers[i], correctAnswerIndexes.includes(i));
    }
    await question.save();
    const poll = await Poll.findById(req.params.pollId);
    poll.addQuestion(question);
    await poll.save();
    res.status(200).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/*// Route that gets the number of correct and incorrect responses for a student
router.get('/students/:id/responses', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      let numCorrect = 0;
      let numIncorrect = 0;
  
      // Iterate through each response for the student
      for (const response of student.responses) {
        // Get the question associated with the response
        const question = await Question.findById(response.question);
  
        // Check if the response was correct or incorrect
        if (response.answer === question.answers[question.correctAnswerIndex]) {
          numCorrect++;
        } else {
          numIncorrect++;
        }
      }
  
      // Return the number of correct and incorrect responses for the student
      res.json({ numCorrect, numIncorrect });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });*/
  
module.exports = router;