import React, { Component } from "react";
import { motion } from "framer-motion";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("⚠️ Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, errorMessage = "Something went wrong!" } = this.props;

    if (hasError) {
      return fallback ? (
        fallback
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center max-w-md"
          >
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
              {errorMessage}
            </h1>
            {error && <p className="text-sm mt-2">{error.toString()}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={this.resetErrorBoundary}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
