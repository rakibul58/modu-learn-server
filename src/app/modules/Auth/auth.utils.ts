import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

// creating jwt token
export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: SignOptions['expiresIn'],
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

// verifies token
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
