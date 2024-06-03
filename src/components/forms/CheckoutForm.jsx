import { useEffect, useState, useContext } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import db from "@/app/firestore";
import { setDoc, collection, doc, addDoc } from "firebase/firestore";
import { GlobalContext } from "@/context";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postContribution = async (data) => {
    try {
      const new_collection = collection(db, "contributions");
      const plainData = JSON.parse(JSON.stringify(data)); // Ensure data is a plain object

      console.log({ plainData });
      return await addDoc(new_collection, plainData, { merge: true });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        console.log({ paymentIntent }, paymentIntent.id, user);

        postContribution({
          amount: paymentIntent.amount,
          contribution_year: 3000,
          status: "completed",
          user: user.uid,
          payment_id: paymentIntent.id,
          funding_source: "ach",
          submission_date: new Date(),
        }).then((res) => {
          console.log("FIRESTORE", res);
        });

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }

        await setTimeout(() => setMessage(null), 52000);
      });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000",
        payment_method_data: {
          billing_details: {
            name: "Jenny Rosen",
            email: "J3Q5A@example.com",
          },
        },
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    fields: {
      billingDetails: {
        name: "never",
        email: "never",
      },
    },
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h3 className="text-slate-500  text-xl mb-[24px] text-center">
        Select the account to make the payment
      </h3>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full text-lg py-3 my-[24px]"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      {/* Show any error or success messages
      {message && <div id="payment-message">{message}</div>} */}
    </form>
  );
}
