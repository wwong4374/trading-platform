import { Request, Response } from 'express';

type ControllerFn<T> = (req: Request) => Promise<T | null>;

export function controller<T>(fn: ControllerFn<T>) {
  return async (req: Request, res: Response) => {
    try {
      const result = await fn(req);
      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(result);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
