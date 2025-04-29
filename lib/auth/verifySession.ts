import jwt, { JwtPayload } from "jsonwebtoken";

export function verifySession(session: string): JwtPayload {
	return jwt.verify(session, process.env.JWT_SECRET!) as JwtPayload;
}
