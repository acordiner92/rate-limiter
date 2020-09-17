import { Request, Response, NextFunction } from 'express';
import { RunRateLimitCheck } from './RateQuotaHandler';
/**
 * Applies rate limiting as an express middleware.
 * It goes on the basis of the request's ip address
 * as the identifier.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {(Response<string> | void)}
 */
export const rateLimiterMiddleware = (runRateLimitCheck: RunRateLimitCheck) => (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<string> | void => {
  const identifier = req.ip;
  const response = runRateLimitCheck(identifier);
  if (response.hasExceeded) {
    // the retry value is in ms so we need to convert it to seconds
    // we are rounding up to play it safe to nearest second.
    const retryInSeconds = Math.ceil(response.retryIn / 1000);
    return res
      .status(429)
      .send(`Rate limit exceeded. Try again in ${retryInSeconds} seconds`);
  } else {
    return next();
  }
};
