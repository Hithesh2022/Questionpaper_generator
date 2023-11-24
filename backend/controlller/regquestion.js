import dotenv from 'dotenv';
dotenv.config();
import QuestionPaper from '../models/Questionpapermodel.js';


export const addQuestion = async (req, res) => {
  try {
    const { question, difficulty, subject, topic, marks } = req.body;

    // Validate that required fields are present
    if (!question || !difficulty || !subject || !topic || !marks) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify if a similar question already exists
    const existingQuestion = await QuestionPaper.findOne({ Question: question });

    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already exists' });
    }

  

    // Create a new QuestionPaper instance
    const newQuestion = new QuestionPaper({
      Question: question,
      difficulty,
      subject,
      topic,
      marks,
    });

    // Save the new question to the database
    await newQuestion.save();

    console.log(newQuestion);
    res.status(201).json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
