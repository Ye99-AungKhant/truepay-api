import React, { useState } from 'react'
import { useQuery } from 'react-query';
import Pagination from '../component/Pagination';

const Transaction = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTransactionData = async (page) => {
        const response = await fetch(`https://truepay-api.onrender.com/admin/transactions?page=${page}`);
        return response.json();
    };
    const { data, isLoading, error } = useQuery(['transaction', currentPage], () => fetchTransactionData(currentPage));

    if (isLoading) return <div>Loading...</div>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', { timeZone: 'UTC' });
    }

    return (
        <div className='main-container'>
            <div className='main-title'>
                <h3>Transaction</h3>
            </div>
            <div className='userDetail-container userDetail-card'>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Transaction ID</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Amount</th>
                            <th>Note</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.transaction.map((trans) => (
                            <tr>
                                <td>{trans.id}</td>
                                <td>{trans.transactionId}</td>
                                <td>{trans.sender.name}({trans.sender.phone})</td>
                                <td>{trans.recipient.name} ({trans.recipient.phone})</td>
                                <td>{trans.amount}</td>
                                <td>{trans.note}</td>
                                <td>{formatDate(trans.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='paginate'>
                <Pagination totalPages={data.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
        </div>
    )
}

export default Transaction