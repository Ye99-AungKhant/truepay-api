import React, { useState } from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsThreeDotsVertical, BsGraphUpArrow }
    from 'react-icons/bs'
import { useQuery } from 'react-query';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
    from 'recharts';
import Pagination from '../component/Pagination';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchTransactionData = async (page) => {
        const response = await fetch(`https://truepay-api.onrender.com/admin`);
        return response.json();
    };
    const { data, isLoading, error } = useQuery(['homeData', currentPage], () => fetchTransactionData(currentPage));
    if (data) {
        console.log('data', data);

    }
    if (isLoading) return <div>Loading...</div>;

    const avgTransaction = data.todayAverageTransactionForChart
    const monthlyTransaction = data.monthlyTransactions

    const handleUserDetail = (user) => {
        navigate(`/userslist/${user.id}`, { state: { user } })
    }


    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Total Users</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{data.totalUser}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Pending Users</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{data.totalPendingUser}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Monthly Transaction Amount</h3>
                        <BsGraphUpArrow className='card_icon' />
                    </div>
                    <h1>{data.totalTransactionForMonth._sum.amount}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Today Transaction</h3>
                        <BsGraphUpArrow className='card_icon' />
                    </div>
                    <h1>{data.totalTodayTransactions}</h1>
                </div>
            </div>

            <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={avgTransaction}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageAmount" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={monthlyTransaction}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                    </LineChart>
                </ResponsiveContainer>

            </div>
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <h5>Daily Transaction Amount</h5>
                <h5>Monthly Transaction Amount</h5>
            </div>
            <div className='userDetail-card userDetail-transaction'>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone No.</th>
                            <th>Status</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.pendingUser.map((user) => (
                            <tr>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td><span style={{ backgroundColor: 'yellow', padding: 3, borderRadius: 20, color: 'black' }}>{user.status}</span></td>
                                <td style={{ cursor: 'pointer' }} onClick={() => handleUserDetail(user)}><BsThreeDotsVertical /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='paginate'>
                    <Pagination totalPages={data.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                </div>
            </div>

        </main>

    )
}

export default Home