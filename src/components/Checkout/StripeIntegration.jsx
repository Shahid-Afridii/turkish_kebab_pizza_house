import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const StripeIntegration = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isElementLoaded, setIsElementLoaded] = useState(false);

  // ✅ Ensure PaymentElement is loaded before allowing submission
  useEffect(() => {
    if (elements) {
      const paymentElement = elements.getElement(PaymentElement);
      if (paymentElement) {
        setIsElementLoaded(true);
      }
    }
  }, [elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not initialized. Please wait...");
      return;
    }

    if (!isElementLoaded) {
      setErrorMessage("Payment form is still loading. Please wait...");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    console.log("Processing Payment...");

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/payment-success",
        },
      });

      if (result.error) {
        console.error("Payment Error:", result.error.message);
        setErrorMessage(result.error.message);
        setIsProcessing(false);
      } else {
        console.log("Payment Success!", result.paymentIntent);
      }
    } catch (error) {
      console.error("Payment Processing Failed:", error);
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {elements ? (
        <>
          <PaymentElement onReady={() => setIsElementLoaded(true)} />
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          <button
           aria-label={
            isProcessing
              ? "Processing your Stripe payment"
              : "Submit payment now with Stripe"
          }
            type="submit"
            disabled={!stripe || !isElementLoaded || isProcessing}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </>
      ) : (
        <p>Loading payment form...</p>
      )}
    </form>
  );
};

export default StripeIntegration;
