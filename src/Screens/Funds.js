import React from "react";
import "../Css/funds.css";
function Funds(props) {
  return (
    <div className="funds-contianer ">
      <div className="funds-header">
        <h3>Funds</h3>
      </div>
      <div className="fund-amount">
        <h1>Total Amount : ₱ 9999.99</h1>
        <div>
          <h3>Total Deposit: ₱ 1000.99</h3>
          <h3>Total Withdraw: ₱ 1000.99</h3>
        </div>
      </div>
      <div className="funds-filter">
        <h4>Filter Section : </h4>
      </div>
      <div className="funds-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MIke D. Sample</td>
              <td>mike@sample.com</td>
              <td>Deposit</td>
              <td>1000</td>
              <td> September 09, 2024</td>
              <td>{/* <button onClick={handleShow}>View More</button> */}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Funds;
