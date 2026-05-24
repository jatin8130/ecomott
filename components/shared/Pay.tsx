"use client";

import { FC, useState } from "react";
import { Button, Modal, Result } from "antd";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useRouter } from "next/navigation";

import priceCalculate from "@/lib/price-calculate";
import clientCatchError from "@/lib/client-catch-error";

/* ---------------- TYPES ---------------- */

interface RazorpayPaymentFailedResponse {
  error: {
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

interface ModifiedRazorpayInterface
  extends Omit<RazorpayOrderOptions, "notes"> {
  notes: RazorpayNotes;
}

interface CartInterface {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  image: string;
  slug: string;
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

/* ---------------- COMPONENT ---------------- */

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
  const user = session.data?.user;

  /* ---------------- SAFE CHECK ---------------- */

  const hasAddress = !!user?.address?.pincode;

  /* ---------------- TOTAL AMOUNT ---------------- */

  const getTotalAmount = () => {
    let sum = 0;

    const items = isArr ? product : [product];

    for (const item of items) {
      const price = item.price ?? 0;
      const discount = item.discount ?? 0;

      sum += priceCalculate(price, discount) * item.quantity;
    }

    return sum;
  };

  /* ---------------- ORDER PAYLOAD ---------------- */

  const getOrderPayload = () => {
    const products: string[] = [];
    const prices: number[] = [];
    const discounts: number[] = [];
    const quantities: number[] = [];

    const items = isArr ? product : [product];

    for (const item of items) {
      if (!item) continue;

      // IMPORTANT: backend uses "id", NOT "_id"
      products.push(item.id);
      prices.push(item.price ?? 0);
      discounts.push(item.discount ?? 0);
      quantities.push(item.quantity);
    }

    return { products, prices, discounts, quantities };
  };

  /* ---------------- PAYMENT ---------------- */

  const payNow = async () => {
    try {
      if (!user) throw new Error("Session not ready");

      if (!hasAddress) {
        sessionStorage.setItem("message", "Please update your address first");
        router.push("/user/settings");
        return;
      }

      if (!Razorpay) throw new Error("Razorpay SDK failed to load");

      const amount = isArr
  ? getTotalAmount()
  : priceCalculate(
      product.price,
      product.discount
    );

      const { data: orderData } = await axios.post("/api/razorpay/orders", {
  amount: Number(amount), // ✅ raw rupees
});

      const options: ModifiedRazorpayInterface = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        name: "ecom shop",
        description: "Order Payment",
        amount: orderData.amount,
        order_id: orderData.id,
        currency: "INR",

        prefill: {
          name: user.name as string,
          email: user.email as string,
        },

        notes: {
          name: user.name as string,
          user: user.id,
          orders: JSON.stringify(getOrderPayload()),
        },

        handler: async (res) => {
          onSuccess?.(res);
        },
      };

      const rzp = new Razorpay(
        options as unknown as RazorpayOrderOptions
      );

      rzp.open();

      rzp.on("payment.failed", (err: RazorpayPaymentFailedResponse) => {
        setOpen(true);

        onFailed?.({
          reason: err.error.reason,
          order_id: err.error.metadata.order_id,
          payment_id: err.error.metadata.payment_id,
        });
      });
    } catch (err) {
      clientCatchError(err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <Button
        size="large"
        type="primary"
        onClick={payNow}
        className={
          theme === "happy"
            ? "w-full! py-6! bg-green-500!"
            : "w-full! py-6!"
        }
      >
        {title}
      </Button>

      <Modal
        open={open}
        footer={null}
        width="50%"
        onCancel={() => setOpen(false)}
      >
        <Result
          status="error"
          title="Payment Failed"
          subTitle="Payment was not completed. Please try again."
          extra={[
            <Link href="/" key="home">
              <Button type="primary">Go Back</Button>
            </Link>,
          ]}
        />
      </Modal>
    </>
  );
};

export default Pay;