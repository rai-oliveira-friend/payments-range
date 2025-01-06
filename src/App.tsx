import { useState, useEffect, useRef } from 'react';
import { Transaction, getTransactions, ResponseTransaction } from './api';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sizePage] = useState<number>(5); // Transactions per page
  const [initDate, setInitDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for date input fields
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response: ResponseTransaction = await getTransactions({
          initDate: initDate ? initDate : undefined,
          endDate: endDate ? endDate : undefined,
          currentPage,
          sizePage,
        });
        setTransactions(response.items);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [initDate, endDate, currentPage, sizePage]);

  const handleDateFilter = (e: React.FormEvent) => {
    e.preventDefault();

    // Get date values from the refs
    if (startDateRef.current && endDateRef.current) {
      setInitDate(new Date(startDateRef.current.value));
      setEndDate(new Date(endDateRef.current.value));
    }
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Payment Transaction Dashboard</h1>
      <form onSubmit={handleDateFilter}>
        <input
          type="date"
          ref={startDateRef}  // Using the ref here
          className="date"
        />
        <input
          type="date"
          ref={endDateRef}  // Using the ref here
          className="date"
        />
        <button className="filter-btn">Filter</button>
      </form>

      {error && <p className="error">{error}</p>}

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.date.toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePagination(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
