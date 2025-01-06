export type Transaction = {
    id: number;
    date: Date;
    description: string;
    amount: number;
}

export const MOCK_DATA: Transaction[] = [
    {
        id: 1,
        date: new Date('2025-01-03'),
        description: 'some 1',
        amount: 123.5
    },
    {
        id: 2,
        date: new Date('2024-12-03'),
        description: 'some 2',
        amount: 13.8
    },
    {
        id: 3,
        date: new Date('2024-12-30'),
        description: 'some 3',
        amount: 25.3
    }
]

const simulatePromise = (fn: any) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(fn());
        }, 1500)
    })
}

type Request = {
    initDate?: Date;
    endDate?: Date;
    currentPage: number;
    sizePage: number;
}
export type ResponseTransaction = {
    totalPages: number;
    items: Transaction[];
}
export const getTransactions = async (request: Request): Promise<ResponseTransaction> => {
    const { initDate, endDate, currentPage, sizePage } = request;
    try {
        let filteredData = [...MOCK_DATA];
        if(initDate && endDate) {
            filteredData = MOCK_DATA.filter(item =>
                item.date >= initDate && item.date <= endDate
            );
        }
        const res = await simulatePromise(() => {
            filteredData.slice((currentPage - 1) * sizePage, currentPage * sizePage);
            return filteredData;
        })
        const n = filteredData.length;
        return {
            totalPages: Math.ceil(n / sizePage),
            items: res as Transaction[]
        };
    } catch (error) {
        console.log(error);
        return {
            totalPages: 0,
            items: []
        }
    }
}