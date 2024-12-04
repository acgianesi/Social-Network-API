import { Router, Request, Response, RequestHandler } from 'express';
import Thought from '../models/Thought';
import User from '../models/User';

const router = Router();

// all thoughts
router.get('/', async (req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        res.status(500).json(error);
    }
});

// single thought by id
router.get('/:thoughtId', (async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (error) {
        res.status(500).json(error);
    }
}) as RequestHandler);

// new thought
router.post('/', async (req: Request, res: Response) => {
    try {
        const { thoughtText, username, userId } = req.body;
        const thought = await Thought.create({ thoughtText, username });

        const user = await User.findById(userId);
        if (user) {
            user.thoughts.push(thought._id);
            await user.save();
        }

        res.status(201).json(thought);
    } catch (error) {
        res.status(500).json(error);
    }
});

// update a thought by id
router.put('/:thoughtId', (async (req: Request, res: Response) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            req.body,
            { new: true }
        );
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
    } catch (error) {
        res.status(500).json(error);
    }
}) as RequestHandler);

// thought by id
router.delete('/:thoughtId', (async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json({ message: 'Thought deleted' });
    } catch (error) {
        res.status(500).json(error);
    }
}) as RequestHandler);

// post reactions 
router.post('/:thoughtId/reactions', (async (req: Request, res: Response) => {
    try {
        const { reactionBody, username } = req.body;
        const thoughtId = req.params.thoughtId;
        if (!reactionBody || !username) {
            return res.status(400).json({ message: 'Reaction body and username are required' });
        }

        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        thought.reactions.push({
            reactionBody,
            username,
        });

        await thought.save();

        res.status(200).json(thought);
    } catch (error) {
        res.status(500).json(error);
    }
}) as RequestHandler);

// delete reactions
router.delete('/:thoughtId/reactions/:reactionId', (async (req: Request, res: Response) => {
    try {
      const { thoughtId, reactionId } = req.params;
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      const reactionIndex = thought.reactions.findIndex((reaction) => reaction._id.toString() === reactionId);
      if (reactionIndex === -1) {
        return res.status(404).json({ message: 'Reaction not found' });
      }
  
      thought.reactions.splice(reactionIndex, 1);
  
      await thought.save();
  
      res.status(200).json({ message: 'Reaction deleted successfully', thought });
    } catch (error) {
      res.status(500).json(error);
    }
  }) as RequestHandler);
  
export default router;
