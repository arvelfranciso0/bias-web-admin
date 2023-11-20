import React, { useState, useEffect } from "react";
import "../Css/withdrawalrequest.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function WithdrawalRequest(props) {
  const [response, setResponse] = useState(null);
  const [withdrawRequestList, setWithdrawalRequestList] = useState([]);
  const clientId =
    "AdoQUb986Cigyd6JiPQYo8h9S7Rh3TIwvQiAE4_4VAUJYHOZ25Fnfa2xC2FhxKwqfxMcx5X12x021RXJ";
  const clientSecret =
    "EGTcUMEpfiTSPrY3VmLP9UGMVVT1gJbcLAi8uNu6MWc45aWYX1tzC4xpPl4iTPaFgeuKp3GeDe_7PHe9";
  const accessToken = btoa(`${clientId}:${clientSecret}`);
  const handlePayout = async (amount, email, id) => {
    axios
      .get("http://localhost:3006/admin/getCountFundLogPaypal")
      .then((res) => {
        if (res.data.status) {
          const todayYear = new Date().getFullYear();
          const sender_batch_id = `${todayYear}00${res.data.result[0].numofTransWithdraw}`;

          console.log(sender_batch_id);
          PayoutToPaypal(sender_batch_id, email, amount, id);
        }
      });
  };

  const PayoutToPaypal = async (sender_batch_id, email, amount, id) => {
    try {
      const payoutData = {
        sender_batch_header: {
          sender_batch_id: sender_batch_id,
          email_subject: "You have a payout!",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: amount,
              currency: "PHP",
            },
            note: "Thanks for your patronage!",
            sender_item_id: id,
            receiver: email,
            recipient_wallet: "PAYPAL",
          },
        ],
      };

      const response = await axios.post(
        "https://api-m.sandbox.paypal.com/v1/payments/payouts",
        JSON.stringify(payoutData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      const payout_batchId = response.data.batch_header.payout_batch_id;
      axios
        .post("http://localhost:3006/paypal-api", {
          payout_batchId: payout_batchId,
          withTrans_id: id,
        })
        .then((res) => {
          if (res.data.status) {
            alert(res.data.message);
          } else {
            alert(res.data.message);
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCheckPayouts = async () => {
    // try {
    //   const response = await axios.get(
    //     "https://api-m.sandbox.paypal.com/v1/payments/payouts/QKVNWREGHPWGA",
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );
    //   console.log("Response:", response.data);
    // } catch (error) {
    //   console.error("Error:", error.message);
    // }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3006/getWithdrawalUser")
      .then((res) => {
        if (res.data.status) {
          setWithdrawalRequestList(res.data.result);
          console.log(res.data.result);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);
  const handleTransType = (e) => {
    if (e === "withdraw") {
      return "Withdraw Funds";
    } else if (e === "withdrawCapital") {
      return "Withdraw Capital";
    }
  };
  return (
    <div className="withdrawal-request-contianer">
      <div className="withdrawal-request-header">
        <h3>Withdrawal Request</h3>
      </div>
      <div className="withdrawal-request-filter">
        <h4>Filter Section : </h4>
        <div className="range-container">
          <div className="start-date">
            <label id="approve-title">Start Date : </label>
            <input type="date" />
          </div>
          <div className="end-date">
            <label id="approve-title">End Date :</label>
            <input type="date" />
          </div>
          <FontAwesomeIcon
            icon={faSort}
            title="Click here to sort the date"
            className="sort-range-date"
          />
        </div>
      </div>
      <div className="withdrawal-request-table">
        <table>
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>Name </th>
              <th>Amount</th>
              <th>Paypal Email</th>
              <th>Type</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequestList.map((item, index) => (
              <tr key={index}>
                <td>{item.withTrans_trans_id}</td>
                <td>{`${item.user_fname} ${item.user_lname}`}</td>
                <td>{item.withTrans_amt}</td>
                <td>{item.withTrans_PaypalEmail}</td>
                <td>{handleTransType(item.wlt_trans_type)}</td>
                <td>{new Date(item.withTrans_created_at).toDateString()}</td>
                <td>
                  <button
                    onClick={() =>
                      handlePayout(
                        item.withTrans_amt,
                        item.withTrans_PaypalEmail,
                        item.withTrans_id
                      )
                    }
                  >
                    Send Withdrawal
                  </button>
                  <button onClick={handleCheckPayouts}>Check Payouts</button>
                  <br />
                  <button>Decline Withdrawal</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WithdrawalRequest;
