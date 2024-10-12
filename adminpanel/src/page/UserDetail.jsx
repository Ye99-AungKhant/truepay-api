import React, { useEffect, useState } from 'react'
import '../style/page.css'
import defaultUser from '../image/user.png'
import Pagination from '../component/Pagination'
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from 'react-router-dom';
import Modal from '../component/Modal';

const UserDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const { user } = location.state || {};
    const [userStatus, setUserStatus] = useState(user.status)
    const [userBalance, setUserBalance] = useState(user.balance)
    const [isModalOpen, setModalOpen] = useState(false);
    const [idImgUrl, setIdImgUrl] = useState('')
    const [editing,setEditing] = useState(false)
    const queryClient = useQueryClient();

    const openModal = (IDImgUrl) => {
        setIdImgUrl(IDImgUrl)
        setModalOpen(true);
    }
    const closeModal = () => setModalOpen(false);

    const fetchTransferData = async (page) => {
        const response = await fetch(`https://truepay-api.onrender.com/admin/userdetail/${user.id}?page=${page}`);
        return response.json();
    };
    const { data, isLoading, error } = useQuery(['userDetail', currentPage], () => fetchTransferData(currentPage));

    const userVerify = useMutation(async (userId) => {
        return await fetch(`https://truepay-api.onrender.com/admin/userVerify`, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
    }, {
        onError: async (e) => {
            console.log(e);
        },
        onSuccess: async (data) => {
            const verifyData = await data.json()
            console.log('userdata res', verifyData);

            setUserStatus(verifyData.status)
        }
    })

    if (isLoading) return <div>Loading...</div>;


    const handleUserConfirm = () => {
        userVerify.mutate(user.id)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', { timeZone: 'UTC' });
    }

    const handleDeposit=(e)=>{
        e.preventDefault()
        fetch(`https://truepay-api.onrender.com/admin/deposit`, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({ userId:user.id, depositAmount:editing }),
        })
        setEditing(false)
        queryClient.invalidateQueries(['userDetail'])
      }

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
                                    <td>{userStatus}</td>
                                    <td>{user.userverify[0]?.gender}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                </tr>
                            </tbody>
                        </table>
                        {userStatus == 'Pending' &&
                            <button style={{ border: 'none', backgroundColor: 'green', color: 'white', borderRadius: 10, cursor: 'pointer' }}
                                onClick={handleUserConfirm}
                            >
                                Confirm
                            </button>
                        }

                    </div>
                </div>
                <div className="userDetail-body ">
                    <div className='userDetail-card' style={{ width:'200px' }}>
                        <caption>Deposit</caption>
                        {!editing && <div onDoubleClick={()=>setEditing(true)}>{userBalance}</div>}
                                    {editing && <form action="" onSubmit={handleDeposit} onDoubleClick={()=>setEditing(false)}> 
                                        <input type="text" className="todo-item-input" value={userBalance} onChange={(e)=>setUserBalance(e.target.value)} />
                                    </form> }
                    </div>

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
                                    <td onClick={() => openModal(data.front_id_url)} className='idImgBtn'>View</td>
                                    <td onClick={() => openModal(data.back_id_url)} className='idImgBtn'>View</td>
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
                                    <td>{formatDate(transaction.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='paginate'>
                        <Pagination totalPages={data.totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                    </div>

                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} idImgUrl={idImgUrl} />
        </main>
    )
}

export default UserDetail