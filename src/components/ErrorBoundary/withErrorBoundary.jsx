import React, { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

const withErrorBoundary = (Component, Fallback, errorMessage = "Something went wrong!") => (props) =>
  (
    <ErrorBoundary fallback={<div className="text-red-500">{errorMessage}</div>}>
      <Suspense fallback={Fallback || <div>Loading...</div>}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );

export default withErrorBoundary;
