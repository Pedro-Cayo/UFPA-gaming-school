import mongoose from 'mongoose';

const questionnaireSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  disciplineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discipline',
    required: true
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    options: [String],
    correctAnswer: String,
    points: Number
  }],
  totalPoints: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Questionnaire', questionnaireSchema);
