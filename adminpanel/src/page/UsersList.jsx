import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom'
import defaultUser from '../image/user.png'
import Pagination from '../component/Pagination';


const UsersList = () => {

    const navigate = useNavigate();

    const handleUserDetail = (userId) => {
        navigate(`/userslist/${userId}`)
    }

    const fetchTransferData = async () => {
        const response = await fetch('http://localhost:3000/admin/user?page=1');
        return response.json();
    };
    const { data, isLoading, error } = useQuery(['transferData'], () => fetchTransferData());
    if (data) {
        console.log('data', data);

    }
    if (isLoading) return <div>Loading...</div>;

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>User List</h3>
            </div>
            <div className='userlist-container'>
                <table>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone No.</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Detail</th>
                    </tr>

                    {data.users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                {user.profile_url ?
                                    <img src={user.profile_url} alt="profile" />
                                    :
                                    <img src={defaultUser} alt="profile" className='profileImg' />
                                }
                            </td>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.balance}</td>
                            <td>{user.status}</td>
                            <td style={{ cursor: 'pointer' }} onClick={() => handleUserDetail(user.id)}><BsThreeDotsVertical /></td>
                        </tr>
                    ))}

                </table>
                <Pagination totalPages={data.totalPages} />
            </div>
        </main>
    )
}

export default UsersList