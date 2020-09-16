import { Request, Response, NextFunction } from 'express';
import { GetHasRateLimitExceeded } from './RateLimiter';

export const rateLimiterMiddleware = (
  getHasRateLimitExceeded: GetHasRateLimitExceeded,
) => (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<string> | void => {
  const identifier = req.ip;
  const response = getHasRateLimitExceeded(identifier);
  if (response.hasExceeded) {
    const retryInSeconds = Math.ceil(response.retryIn / 1000);
    return res
      .status(429)
      .send(`Rate limit exceeded. Try again in ${retryInSeconds} seconds`);
  } else {
    return next();
  }
};
