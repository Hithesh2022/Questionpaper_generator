import dotenv from "dotenv";
import mongoose from "mongoose";


const questionPaperSchema = new mongoose.Schema({
  Question: {
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



// Create a Mongoose model
const QuestionPaper = mongoose.model('questionPaper', questionPaperSchema);

export default QuestionPaper;
