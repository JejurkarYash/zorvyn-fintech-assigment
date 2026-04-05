export declare function getCategories(startDate?: Date, endDate?: Date): Promise<{
    category: import("@prisma/client").$Enums.Category;
    type: import("@prisma/client").$Enums.Type;
    total: number;
    count: number;
}[]>;
export declare function fetchMonthlyTrends(year?: number): Promise<{
    month: string;
    monthNumber: number;
    year: number;
    income: number;
    expense: number;
    netBalance: number;
}[]>;
export declare function validateYear(yearParam: unknown): {
    valid: boolean;
    year?: number;
    error?: string;
};
export declare function fetchRecentTransactions(limit?: number): Promise<{
    type: import("@prisma/client").$Enums.Type;
    amount: number;
    category: import("@prisma/client").$Enums.Category;
    date: Date;
    description: string | null;
    id: string;
    createdAt: Date;
}[]>;
