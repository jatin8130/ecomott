"use client";

import { FC, useState } from "react";
import { Button, Modal, Result } from "antd";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

import priceCalculate from "@/lib/price-calculate";
import clientCatchError from "@/lib/client-catch-error";
import { FetchedProductInterface } from "../admin/Products";
import { useRouter } from "next/navigation";

interface RazorpayPaymentFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

interface RazorpayNotes {
  orders: string;
  name: string;
  user: string;
}

interface ModifiedRazorpayInterface extends Omit<
  RazorpayOrderOptions,
  "notes"
> {
  notes: RazorpayNotes;
}

interface CartInterface {
  _id: string;
  user: string;
  product: FetchedProductInterface;
  qnt: number;
  createdAt: string;
  updatedAt: string;
}

interface PaymentSuccessInterface {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentFailedInterface {
  reason: string;
  order_id: string;
  payment_id: string;
}

interface PayInterface {
  theme?: "happy" | "sad";
  title?: string;
  product: CartInterface | CartInterface[];
  onSuccess?: (payload: PaymentSuccessInterface) => void;
  onFailed?: (payload: PaymentFailedInterface) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayPaymentFailedResponse) => void,
  ) => void;
}

const Pay: FC<PayInterface> = ({
  product,
  onSuccess,
  onFailed,
  title = "Pay now",
  theme = "happy",
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const session = useSession();
  const { Razorpay } = useRazorpay();

  const isArr = Array.isArray(product);

  const getTotalAmount = () => {
    let sum = 0;

    if (isArr) {
      for (const item of product) {
        const amount =
          priceCalculate(item.product.price, item.product.discount) * item.qnt;

        sum += amount;
      }
    } else {
      const amount =
        priceCalculate(product.product.price, product.product.discount) *
        product.qnt;

      sum += amount;
    }

    return sum;
  };

  const getOrderPayload = () => {
    const products: string[] = [];
    const prices: number[] = [];
    const discounts: number[] = [];
    const quantities: number[] = [];

    if (!isArr) {
      return {
        products: [product.product._id],
        prices: [product.product.price],
        discounts: [product.product.discount],
        quantities: [product.qnt],
      };
    }

    for (const item of product) {
      products.push(item.product._id);
      prices.push(item.product.price);
      discounts.push(item.product.discount);
      quantities.push(item.qnt);
    }

    return {
      products,
      prices,
      discounts,
      quantities,
    };
  };

  const handleSuccess = (payload: PaymentSuccessInterface) => {
    if (onSuccess) {
      return onSuccess(payload);
    }

    return null;
  };

  const payNow = async () => {
    try {
      if (!session.data) {
        throw new Error("Session not initialized yet");
      }

      if (!session.data.user.address?.pincode) {
        sessionStorage.setItem("message", "Please update your address first");
        return router.push("/user/settings");
      }

      if (!Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const payload = {
        amount: isArr
          ? getTotalAmount()
          : priceCalculate(product.product.price, product.product.discount),
      };

      const response = await axios.post("/api/razorpay/orders", payload);

      const orderData = response.data;

      const options: ModifiedRazorpayInterface = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        name: "ecom shop",
        description: "Bulk Product",
        amount: orderData.amount,
        order_id: orderData.id,
        currency: "INR",
        prefill: {
          name: session.data.user.name as string,
          email: session.data.user.email as string,
        },
        notes: {
          name: session.data.user.name as string,
          user: session.data.user.id,
          orders: JSON.stringify(getOrderPayload()),
        },
        handler: handleSuccess,
      };

      const rzp = new Razorpay(
        options as unknown as RazorpayOrderOptions,
      ) as RazorpayInstance;

      rzp.open();

      rzp.on("payment.failed", (err: RazorpayPaymentFailedResponse) => {
        setOpen(true);

        const payload: PaymentFailedInterface = {
          reason: err.error.reason,
          order_id: err.error.metadata.order_id,
          payment_id: err.error.metadata.payment_id,
        };

        onFailed?.(payload);
      });
    } catch (err) {
      clientCatchError(err);
    }
  };

  return (
    <>
      {theme === "happy" ? (
        <Button
          size="large"
          type="primary"
          onClick={payNow}
          className="w-full! py-6! font-medium! text-lg! bg-green-500!"
        >
          {title}
        </Button>
      ) : (
        <Button
          danger
          size="large"
          type="primary"
          onClick={payNow}
          className="w-full! py-6! font-medium! text-lg!"
        >
          {title}
        </Button>
      )}

      <Modal
        open={open}
        footer={null}
        width="50%"
        onCancel={() => setOpen(false)}
      >
        <Result
          status="error"
          title="Payment Failed"
          subTitle="An error occured during payment capture please try again after sometime"
          extra={[
            <Link href="/" key="console">
              <Button type="primary">Go Back</Button>
            </Link>,
          ]}
        />
      </Modal>
    </>
  );
};

export default Pay;
