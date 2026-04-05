import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}
export declare function jwtMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
