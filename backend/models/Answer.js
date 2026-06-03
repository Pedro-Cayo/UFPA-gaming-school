import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionnaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
    required: true
  },
  disciplineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discipline',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    points: Number,
    timeSpent: Number
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  totalTime: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Answer', answerSchema);
