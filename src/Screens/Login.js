import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logo.jpg";
export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const loginUser = () => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/login`, {
        email,
        pass,
      })
      .then((res) => {
        if (res.data.status) {
          localStorage.setItem("authAdmin", "authorized");
          localStorage.setItem("admin_id", res.data.result[0].user_id);
          navigate("admin/dashboard");
        } else {
          alert(res.data.message);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response) {
          navigate("/server-error");
        } else if (error.request) {
          navigate("/error");
        } else {
          navigate("/somethingwrong");
        }
      });
  };

  return (
    <div className=" d-flex " style={{ height: "100vh" }}>
      <div className="w-50 bg-dark text-light">
        {" "}
        <div className="d-flex align-items-center gap-1 ps-2">
          <label className="fs-5 fw-bold">BiaS Admin</label>
          <img
            src={logo}
            alt="..."
            className="rounded-circle"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
        </div>
        <div
          className="d-flex flex-column align-items-center  w-100 justify-content-center text-center  "
          style={{ height: "90vh" }}
        >
          {" "}
          <img
            src={logo}
            alt="..."
            className="rounded-circle shadow-lg"
            style={{ width: "15rem", height: "15rem" }}
          />
          <label className="fs-3 ">
            <label className="">
              <strong className="fs-1 ">B</strong>usiness{" "}
              <strong className="fs-1 ">I</strong>
              nvestment <strong className="fs-1 ">A</strong>pplication for{" "}
              <strong className="fs-1 ">S</strong>mall Entrepreneurs
            </label>
          </label>
        </div>
      </div>

      <div className="w-50 row align-items-center col-6 justify-content-center">
        <div className="row align-items-center justify-content-center">
          <h1 className="text-center">Login</h1>
          <div className="col-8">
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@sample.com"
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                class="form-control"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPass(e.target.value)}
              />
              <div class="form-check mt-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label class="form-check-label " for="flexCheckDefault">
                  Show Password
                </label>
              </div>
            </div>

            <div className="text-center d-flex justify-content-center align-items-center">
              <button
                onClick={() => loginUser()}
                class="btn btn-dark rounded d-flex align-items-center justify-content-center gap-3 col-10"
                // disabled={btnStatus}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
