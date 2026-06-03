import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['professor', 'aluno'],
    required: true
  },
  cnpj: {
    type: String,
    sparse: true
  },
  matricula: {
    type: String,
    sparse: true
  },
  photoUrl: {
    type: String,
    default: null
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

export default mongoose.model('User', userSchema);
