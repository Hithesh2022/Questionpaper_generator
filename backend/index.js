import Express from 'express';
import router from './Router/router.js';
import mongoose from 'mongoose';
import mongoConnect from './configs/dbconfig.js';
const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use('/', router);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
 await mongoConnect();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

