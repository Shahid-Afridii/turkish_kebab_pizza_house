import React, { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

const withErrorBoundary = (
  Component,
  Fallback = <div className="text-gray-500">Loading...</div>,
  errorMessage = "Something went wrong!"
) => (props) => (
  <ErrorBoundary errorMessage={errorMessage}>
    <Suspense fallback={Fallback}>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
);

export default withErrorBoundary;
