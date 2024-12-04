import { RequestHandler, Router } from 'express';
import User from '../models/User';
import { Request, Response, } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
});

router.get('/:userId', async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
  res.json(user);
});

router.post('/', async (req: Request, res: Response) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

router.put('/:userId', async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
  res.json(user);
});


 router.post('/:userId/friends/:friendId', (async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  const friend = await User.findById(req.params.friendId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!friend) {
    return res.status(404).json({ message: "Friend not found" });
  }
  user.friends.push(friend._id);
  await user.save();
  res.json({ message: 'Friend added successfully' });
}) as RequestHandler );

// DELETE 
// router.delete('/:userId/friends/:friendId', (async (req: Request, res: Response) => {
//   const user = await User.findById(req.params.userId);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   user.friends.pull(req.params.friendId);
//   await user.save();
//   res.json(user);
// }) as RequestHandler);

// export default router;