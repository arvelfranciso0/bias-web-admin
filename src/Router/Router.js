import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Screens/Login";
import Navigation from "../Components/Navigation";
import Dashboard from "../Screens/Dashboard";
import User from "../Screens/User";

import "../Css/variableCss.css";

import Transactions from "../Screens/Transactions";

import ApproveBusinessModal from "../Components/ApproveBusinessModal";
import UserApproveModal from "../Components/User_Approve_Modal";
import Business from "../Screens/Business";
import Investments from "../Screens/Investments";
import ApproveInvestment from "../Components/ApproveInvestment";
import SendAccumaltedAmount from "../Components/SendAccumaltedAmount";
import ChatComponent from "../Chat/ChatComponent";
import Withdraw from "../Screens/Withdraw";
import Reports from "../Screens/Reports";
import WithdrawalRequest from "../Components/WithdrawalRequest";
import ConnectionError from "../Error/ConnectionError";
import ServerError from "../Error/ServerError";
import GeneralError from "../Error/GeneralError";
import ListOfCategory from "../Components/Categories/ListOfCategory";
export default function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="error" element={<ConnectionError />} />
        <Route path="server-error" element={<ServerError />} />
        <Route path="somethingwrong" element={<GeneralError />} />
        <Route path="/admin" element={<Navigation />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="category" element={<ListOfCategory />} />
          <Route path="user" element={<User />} />
          <Route path="investments" element={<Investments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="business" element={<Business />} />
          <Route path="investments/approval" element={<ApproveInvestment />} />
          <Route path="business/details" element={<ApproveBusinessModal />} />
          <Route path="user/approval" element={<UserApproveModal />} />
          <Route path="chat" element={<ChatComponent />} />
          <Route path="withdraw-details" element={<WithdrawalRequest />} />
          <Route
            path="business/sendamount"
            element={<SendAccumaltedAmount />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
