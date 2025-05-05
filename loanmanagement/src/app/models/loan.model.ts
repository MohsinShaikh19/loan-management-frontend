export interface Loan {
  id: number;
  amount: number;
  termInMonths: number;
  purpose: string;
  status: string;
  applicationDate: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  emiSchedules?: EMISchedule[];
}

export interface EMISchedule {
  id: number;
  loanId: number;
  paymentDate: Date;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  isPaid: boolean;
}

export interface CreateLoanRequest {
  amount: number;
  termInMonths: number;
  purpose: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}