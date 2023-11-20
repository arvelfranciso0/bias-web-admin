import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Screens/Login";
import Navigation from "../Components/Navigation";
import Dashboard from "../Screens/Dashboard";
import User from "../Screens/User";
import Summary from "../Screens/Summary";
import "../Css/variableCss.css";
import Funds from "../Screens/Funds";
import Transactions from "../Screens/Transactions";

import BusinessApproval from "../Components/BusinessApproval";
import UserApproval from "../Components/UserApproval";
import WithdrawalRequest from "../Components/WithdrawalRequest";
import ApproveBusinessModal from "../Components/ApproveBusinessModal";
import UserApproveModal from "../Components/User_Approve_Modal";
import Business from "../Screens/Business";
import Investments from "../Screens/Investments";
import ApproveInvestment from "../Components/ApproveInvestment";
import SendAccumaltedAmount from "../Components/SendAccumaltedAmount";
export default function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/" element={<Navigation />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="investments" element={<Investments />} />
          <Route path="summary" element={<Summary />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="funds" element={<Funds />} />
          <Route path="business" element={<Business />} />
          <Route path="investments/approval" element={<ApproveInvestment />} />
          <Route path="business/approved" element={<ApproveBusinessModal />} />
          <Route path="user/approval" element={<UserApproveModal />} />
          <Route
            path="request/user-withdrawal"
            element={<WithdrawalRequest />}
          />
          <Route
            path="business/sendamount"
            element={<SendAccumaltedAmount />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
