import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10; // Affects the performance and password security level

const questionPaperSchema = new mongoose.Schema({
    encryptedQuestion: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
  });
  questionPaperSchema.pre('save', async function (next) {
    if (this.isModified('encryptedQuestion')) {
      this.encryptedQuestion = await bcrypt.hash(this.encryptedQuestion, saltRounds);
    }
    next();
  });
  
  // Create a Mongoose model
  const QuestionPaper = mongoose.model('qestionPaper', questionPaperSchema);

export default QuestionPaper;