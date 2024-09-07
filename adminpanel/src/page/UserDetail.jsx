import React, { useEffect } from 'react'
import '../style/page.css'
import defaultUser from '../image/user.png'
import Pagination from '../component/Pagination'
import { useQuery } from "react-query";

const UserDetail = () => {


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
                                    <td>1132</td>
                                    <td>Ye Aung</td>
                                    <td>y@gmail.com</td>
                                    <td>09794263094</td>
                                    <td>1,000,000</td>
                                    <td>Verified</td>
                                    <td>Male</td>
                                    <td>01/08/2024</td>
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
                            <tr>
                                <td>1132</td>
                                <td>Ye Aung</td>
                                <td>y@gmail.com</td>
                            </tr>
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
                            <tr>
                                <td>ID Card</td>
                                <td>1/mmn22399</td>
                                <td>y@gmail.com</td>
                                <td>09794263094</td>
                            </tr>

                        </table>
                    </div>

                </div>
                <div className='userDetail-card userDetail-transaction'>
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Transaction ID</th>
                                <th>Recipient</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1132</td>
                                <td>Ye Aung</td>
                                <td>y@gmail.com</td>
                                <td>1,000,000</td>
                                <td>09794263094</td>
                                <td>01/08/2024</td>
                            </tr>
                        </tbody>
                    </table>
                    <Pagination />
                    {/* <div className="paginate">
                        <button className="paginate-prevBtn">Prev</button>
                        <button className="paginate-nextBtn">Next</button>
                    </div> */}
                </div>
            </div>
        </main>
    )
}

export default UserDetail