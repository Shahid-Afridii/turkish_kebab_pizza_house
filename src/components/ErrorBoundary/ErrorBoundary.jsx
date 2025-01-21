import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an external service (optional)
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  resetErrorBoundary = () => {
    // Reset the error state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const { fallback } = this.props;

      // Render the fallback UI if provided
      if (fallback) {
        return typeof fallback === "function"
          ? fallback({ error, errorInfo, resetErrorBoundary: this.resetErrorBoundary })
          : fallback;
      }

      // Default fallback UI
      return (
        <div className="p-6 bg-red-100 text-red-800 rounded-lg">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          {error && <p className="mt-2 text-sm">{error.toString()}</p>}
          {errorInfo && (
            <details className="mt-2 text-xs">
              <summary>Details</summary>
              <pre>{errorInfo.componentStack}</pre>
            </details>
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={this.resetErrorBoundary}
          >
            Try Again
          </button>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
