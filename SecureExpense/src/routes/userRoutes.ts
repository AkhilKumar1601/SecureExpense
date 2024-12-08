import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/user';
import dotenv from 'dotenv';
import verifyToken from '../middleware/authMiddleware';

dotenv.config();

const router = express.Router();

// User registration route
router.post('/register', async (req: Request, res: Response) => {
  const registeredSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    const validateData = registeredSchema.parse(req.body);

    const { name, email, password } = validateData;

    // If user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
     res.status(400).json({
        message: 'User already exists',
      });
      return;
    }

    // If user does not exist, create a new one
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({ message: 'User added successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login route
router.post('/login', async (req: Request, res: Response) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token route
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string; email: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.json({ message: 'User not found' });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
    });
  } catch (e) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Logout route
router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: 'No refresh token provided.' });
    return;
  }

  try {
    res.status(200).json({ message: 'User logged out successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout.' });
  }
});

// Protected profile route
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.status(200).json({
    message: 'This is a protected route.',
    user, // Send back the user data
  });
});

//Route to set/update Budget.
router.put('/:id/budget', async (req : Request, res : Response) => {

  const { id } = req.params;
  const { budget } = req.body;

  try {

    const user = await User.findById(id);

    if(!user) {
      res.status(404).json({message : 'User not found'});
      return;
    }

    user.budget = budget;
    await user.save();

    res.status(200).json({message : 'Budget updated successfully', budget : user.budget})

  } catch (err) {
    res.status(400).json({ message: "Error setting budget", err});
  }

})

export default router;
