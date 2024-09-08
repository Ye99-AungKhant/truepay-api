import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './page/Home';
import UsersList from './page/UsersList';
import UserDetail from './page/UserDetail';
import Transaction from './page/Transaction';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "userslist",
        element: <UsersList />,
      },
      {
        path: "userslist/:userId",
        element: <UserDetail />,
      },
      {
        path: "transaction",
        element: <Transaction />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(

  <RouterProvider router={router} />
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
