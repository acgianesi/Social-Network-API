import express, {Request, Response}  from "express";
import mongoose from "mongoose";
import User from './models/User';

// port
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection to MongoDB
const connectionStringURI = 'mongodb://127.0.0.1:27017/social_network';

mongoose.connect(connectionStringURI);
mongoose.connection.once('open', () => {
  console.log('Mongoose is connected to MongoDB.');
});

// 
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running!');
});

// server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
