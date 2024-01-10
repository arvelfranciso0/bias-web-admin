import React from "react";

function GeneralError(props) {
  return (
    <div className="container mt-5">
      <div className="alert alert-danger text-center" role="alert">
        <h1 className="display-4">Error</h1>
        <p className="lead">Oops! Something went wrong.</p>
        <p>Please try again or contact support.</p>
      </div>
    </div>
  );
}

export default GeneralError;
