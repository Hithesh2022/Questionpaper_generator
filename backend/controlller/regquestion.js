import QuestionPaper from '../models/Questionpapermodel';
import dotenv from "dotenv";
dotenv.config();

export const addQuestion = async (req, res) => {
    try {
        const { Question, difficulty, subject, topic, marks } = req.body;
        const question = new QuestionPaper({
        Question,
        difficulty,
        subject,
        topic,
        marks,
        });
        await question.save();
        res.status(201).json({ message: "Question added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }

