import type { Request, Response } from "express";
export declare function createTransaction(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllTransactions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getTransactionById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateTransaction(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function restoreTransaction(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteTransaction(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getDeletedTransactions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
