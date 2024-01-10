import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ConnectionError(props) {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/checkserverstatus`)
      .then((res) => {
        if (res.data.status) {
          navigate(-1);
        }
      })
      .catch((error) => {
        // if (error.response && error.response.status > 3) {
        //   console.error("Server status is greater than 3. Skipping reload.");
        //   // You may choose to handle this case differently if needed
        // } else {
        //   // Reload the page for other error cases
        //   window.location.reload();
        // }
      });
    // Check if the connection is okay
    // const handleConnectionStatus = () => {
    //   if (navigator.onLine) {
    //     // If connection is okay, reload the page and return to the previous page
    //     window.location.reload();
    //     // If you want to go back to the previous page, you can use navigate(-1)
    //     // navigate(-1);
    //   } else {
    //     // If connection is still not okay, you may choose to handle it differently
    //     console.error("Connection is still not okay.");
    //   }
    // };

    // // Attach the event listener for online/offline events
    // window.addEventListener("online", handleConnectionStatus);
    // window.addEventListener("offline", handleConnectionStatus);

    // // Clean up the event listeners when the component unmounts
    // return () => {
    //   window.removeEventListener("online", handleConnectionStatus);
    //   window.removeEventListener("offline", handleConnectionStatus);
    // };
  }, []);
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="display-4">Connection Error</h1>
          <p className="lead">
            We're sorry, but it seems there is an issue with the connection.
          </p>
          <p>Please check your internet connection and try again.</p>
          <img
            src="https://via.placeholder.com/150"
            alt="Connection Error Illustration"
            className="img-fluid mt-4"
          />
        </div>
      </div>
    </div>
  );
}

export default ConnectionError;
