import React, { useEffect, useState } from 'react'
import '../style/page.css'
import defaultUser from '../image/user.png'
import Pagination from '../component/Pagination'
import { useQuery } from "react-query";
import { useLocation } from 'react-router-dom';

const UserDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const { user } = location.state || {};
    console.log('user', user);

    const fetchTransferData = async (page) => {
        const response = await fetch(`https://truepay-api.onrender.com/admin/userdetail/${user.id}?page=${page}`);
        return response.json();
    };
    const { data, isLoading, error } = useQuery(['userDetail', currentPage], () => fetchTransferData(currentPage));
    if (data) {
        console.log('data', data);

    }
    if (isLoading) return <div>Loading...</div>;

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>User Detail</h3>
            </div>
            <div className='userDetail-container'>
                <div className="userDetail-card userDetail-header ">
                    <img src={defaultUser} alt="" />
                    <div className='userDetail-data'>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone No.</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Gender</th>
                                    <th>Opening Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.balance}</td>
                                    <td>{user.status}</td>
                                    <td>{user.userverify[0]?.gender}</td>
                                    <td>{user.createdAt}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="userDetail-body ">
                    <div className='userDetail-card'>
                        <table>
                            <caption>Address</caption>
                            <tr>
                                <th>Country</th>
                                <th>City</th>
                                <th>Postal Code</th>
                            </tr>
                            {user.userverify.length != 0 && user.userverify.map((data) => (
                                <tr>
                                    <td>{data.country}</td>
                                    <td>{data.city}</td>
                                    <td>{data.postal_code}</td>
                                </tr>
                            ))}
                        </table>
                    </div>

                    <div className='userDetail-card'>
                        <table>
                            <caption>Document</caption>
                            <tr>
                                <th>Type</th>
                                <th>No.</th>
                                <th>Front Photo</th>
                                <th>Back Photo</th>
                            </tr>
                            {user.userverify.length != 0 && user.userverify.map((data) => (
                                <tr>
                                    <td>{data.id_type}</td>
                                    <td>{data.id_no}</td>
                                    <td>{data.front_id_url}</td>
                                    <td>{data.back_id_url}</td>
                                </tr>
                            ))}


                        </table>
                    </div>

                </div>
                <div className='userDetail-card userDetail-transaction'>
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
                            {data.transaction.map((transaction) => (
                                <tr>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.transactionId}</td>
                                    <td>{transaction.sender.name} ({transaction.sender.phone})</td>
                                    <td>{transaction.recipient.name} ({transaction.recipient.phone})</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.note}</td>
                                    <td>{transaction.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='paginate'>
                        <Pagination totalPages={data.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                    </div>

                </div>
            </div>
        </main>
    )
}

export default UserDetail