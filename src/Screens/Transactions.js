import React, { useEffect, useState } from "react";

function Transactions(props) {
  const [selectValue, setSelectValue] = useState("All");
  const [showTypeTransaction, setShowTypeTransaction] = useState("");

  return (
    <div className="container mt-5">
      <table class="table align-middle mb-0 bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Email</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {/* <div class="d-flex align-items-center">
                  {item.buss_photo ? (
                    <img
                      src={item.buss_photo}
                      class="rounded-circle"
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                    />
                  ) : (
                    <img
                      src="https://i.pinimg.com/originals/d6/89/57/d6895790f9870b4597465a4e2b0b676a.png"
                      class="rounded-circle"
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                    />
                  )}

                  <div class="ms-3">
                    <p class="fw-bold mb-1">{item.buss_name}</p>
                  </div>
                </div> */}
            </td>

            <td>
              <span
              // class={`badge rounded-pill  ${
              //   item.buss_status === "pending"
              //     ? "bg-success  text-light "
              //     : item.buss_status === "approved"
              //     ? "bg-info text-dark"
              //     : item.buss_status === "start"
              //     ? "bg-primary text-dark"
              //     : ""
              // }`}
              >
                {/* {item.buss_status} */}
              </span>
            </td>
            <td>{/* <p class="fw-normal mb-1">₱ {item.buss_capital}</p> */}</td>
            <td>
              {/* <p class="fw-normal mb-1">₱ {item.buss_loan_return}</p> */}
            </td>
            <td>
              {/* {item.buss_status === "pending" ? (
                  <Button
                    variant="success"
                    as={NavLink}
                    to={`approved?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                    role="button"
                  >
                    Approved
                  </Button>
                ) : item.buss_status === "approved" ||
                  item.buss_status === "start" ? (
                  <Button variant="primary">View</Button>
                ) : (
                  ""
                )} */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
