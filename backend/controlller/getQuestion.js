import QuestionPaper from '../models/Questionpapermodel.js';

const selectQuestionsWithMatchingMarks = async (marks, numEasyQuestions, numMediumQuestions, numHardQuestions) => {
    let selectedQuestions = [];
    let selectedMarks = 0;
    let attempts = 0;
    const totalDatabaseQuestions = await QuestionPaper.countDocuments();
    const maxAttempts = totalDatabaseQuestions; // Set maxAttempts to the length of available questions
    console.log(maxAttempts);
    while (selectedMarks !== marks && attempts < maxAttempts) {
       const easyQuestions = await QuestionPaper.aggregate([
            { $match: { difficulty: 'Easy', _id: { $nin: selectedQuestions.map(q => q._id) } } },
            { $sample: { size: numEasyQuestions } }
        ]);

        const mediumQuestions = await QuestionPaper.aggregate([
            { $match: { difficulty: 'Medium', _id: { $nin: selectedQuestions.map(q => q._id) } } },
            { $sample: { size: numMediumQuestions } }
        ]);

        const hardQuestions = await QuestionPaper.aggregate([
            { $match: { difficulty: 'Hard', _id: { $nin: selectedQuestions.map(q => q._id) } } },
            { $sample: { size: numHardQuestions } }
        ]);
        // Combine the sampled questions from each difficulty level
        selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        console.log(selectedQuestions);
        // Calculate the total marks of selected questions
        selectedMarks = selectedQuestions.reduce((total, question) => total + question.marks, 0);

        attempts++;

        // Check if the total marks match the user's specified marks
        if (selectedMarks === marks && easyQuestions.length === numEasyQuestions && mediumQuestions.length === numMediumQuestions && hardQuestions.length === numHardQuestions) {
            break; // Exit the loop if the marks match
        }
        console.log(attempts);
        // Check if the maximum attempts limit has been reached
        if (attempts === maxAttempts) {
            // Handle the case where a suitable set of questions cannot be found
            throw new Error('Unable to find a suitable set of questions which match the query  within the specified attempts limit');
        }
    }

    return selectedQuestions;
};

export const getQuestion = async (req, res) => {
    try {
        const { marks, difficulty } = req.body;
        const { Easy, Medium, Hard } = difficulty;

        // Aggregate the total marks available in the database
        const totalDatabaseMarks = await QuestionPaper.aggregate([
            {
                $group: {
                    _id: null,
                    totalMarks: { $sum: "$marks" }
                }
            }
        ]);

        const numEasyQuestions = Math.floor((Easy / 100) * marks);
        const numMediumQuestions = Math.floor((Medium / 100) * marks);
        const numHardQuestions = Math.floor((Hard / 100) * marks);
        console.log(numEasyQuestions, numMediumQuestions, numHardQuestions);
        
        const easyQuestions = await QuestionPaper.aggregate([
            { $match: { difficulty: 'Easy' } }
        ]);

        const mediumQuestions = await QuestionPaper.aggregate([
            { $match: { difficulty: 'Medium' } }
        ]);

        const hardQuestions = await QuestionPaper.aggregate([
            { $match: { difficulty: 'Hard' } }
        ]);

        const response = {
            message: '',
            availableEasyQuestions: easyQuestions.length,
            availableMediumQuestions: mediumQuestions.length,
            availableHardQuestions: hardQuestions.length,
            TotalAvailableMarks: totalDatabaseMarks[0].totalMarks
        };

        // Check if the database has enough marks for the given query
        if (!totalDatabaseMarks.length || totalDatabaseMarks[0].totalMarks < marks) {
            response.message = 'Insufficient marks in the database';
            return res.status(400).json(response);
        }

        // Validate that Easy + Medium + Hard equals 100%
        if (Easy + Medium + Hard !== 100 || Easy + Medium + Hard > 100) {
            return res.status(400).json({ message: 'Percentage distribution of difficulty levels should sum up to 100%' });
        }

       

        // Check for insufficient questions for each difficulty level
        if (easyQuestions.length < numEasyQuestions) {
            response.message = 'Insufficient questions for Easy difficulty level';
            return res.status(400).json(response);
        }

        if (mediumQuestions.length < numMediumQuestions) {
           response.message = 'Insufficient questions for Medium difficulty level';
            return res.status(400).json(response);
        }

        if (hardQuestions.length < numHardQuestions) {
            response.message = 'Insufficient questions for Hard difficulty level';
            return res.status(400).json(response);
        }
         // Query the database to get questions based on the criteria
         const questions = await selectQuestionsWithMatchingMarks(marks, numEasyQuestions, numMediumQuestions, numHardQuestions);

        // If all checks pass, respond with the sampled questions and available questions for each difficulty level
        res.status(200).json(questions);

    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({  error: error.message });
    }
};
