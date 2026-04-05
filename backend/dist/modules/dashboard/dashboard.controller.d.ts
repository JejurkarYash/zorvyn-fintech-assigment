import type { Request, Response } from "express";
export declare function getSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCategoryBreakdown(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMonthlyTrends(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getRecentTransactions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
