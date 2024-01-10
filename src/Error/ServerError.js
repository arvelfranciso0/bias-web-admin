import React from "react";

function ServerError(props) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="display-4">Server Error</h1>
          <p className="lead">Oops! Something went wrong on the server.</p>
          <p>Please try again later.</p>
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

export default ServerError;
