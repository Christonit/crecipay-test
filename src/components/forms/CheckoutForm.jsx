import { useEffect, useState, useContext } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import db from "@/app/firestore";
import { collection, addDoc } from "firebase/firestore";
import { GlobalContext } from "@/context";
import { useSearchParams } from "next/navigation";
import { TypographyH1 } from "@/components/ui/typography";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const search_params = useSearchParams();

  const postContribution = async (data) => {
    try {
      const new_collection = collection(db, "contributions");
      const plainData = JSON.parse(JSON.stringify(data)); // Ensure data is a plain object

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
        console.log("PaymentIntent: ", paymentIntent);
        switch (paymentIntent.status) {
          case "succeeded":
          case "processing":
            postContribution({
              amount: paymentIntent.amount,
              contribution_year: search_params?.get("year"),
              status: "completed",
              user: user.uid,
              payment_id: paymentIntent.id,
              funding_source: "ach",
              submission_date: new Date(),
            });
            if (search_params?.get("redirect_status") === "succeeded") {
              setStatus("succeeded");
            }
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
      return;
    }

    setIsLoading(true);

    console.log("submitting", { user });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          process.env.NEXT_PUBLIC_BACKEND +
          "/contributions/checkout?amount=" +
          search_params?.get("amount") +
          "&year=" +
          search_params?.get("year"),
        payment_method_data: {
          billing_details: {
            name: "Fulano de Tal",
            email: user.email,
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

  if (status === "succeeded")
    return (
      <div className="flex flex-col items-center mx-autp">
        <div className="mb-[24px] w-[200px] h-[200px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="200px"
            viewBox="0 0 24 24"
            width="200px"
            fill="#28a745"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h3 className="text-slate-500  text-xl mb-[24px] text-center">
          Thank you for your contribution!
        </h3>
        <Button
          disabled={isLoading || !stripe || !elements}
          className="w-full text-lg py-3 my-[24px] max-w-[300px] mx-auto"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back to Home
        </Button>
      </div>
    );
  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="max-w-[620px] mx-auto"
    >
      <TypographyH1 className="mb-[24px] text-center">
        Make contribution
      </TypographyH1>
      <h3 className="text-slate-500  text-xl mb-[24px] text-center">
        Select the account to make the payment
      </h3>

      {message && (
        <div
          id="payment-message"
          className="text-base text-[#FF2626] p-[24px] bg-[#FFCACA] border-[2px] rounded-[12px] border-[#FF2626] mb-[32px] text-center"
        >
          {message}
        </div>
      )}
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
    </form>
  );
}
