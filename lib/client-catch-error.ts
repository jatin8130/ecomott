<<<<<<< HEAD
import { message } from "antd";
import { isAxiosError } from "axios";

const clientCatchError = (err: unknown, msg: string | null = null) => {
  if (msg) return message.error(msg);

  if (isAxiosError(err)) {
    return message.error(err.response?.data.message || err.message);
  }

  if (err instanceof Error) {
    return message.error(err.message);
  }

  return message.error("Something went wrong");
};

export default clientCatchError;
=======
import { message } from "antd";
import { isAxiosError } from "axios";

const clientCatchError = (err: unknown, msg: string | null = null) => {
  if (msg) return message.error(msg);

  if (isAxiosError(err)) {
    return message.error(err.response?.data.message || err.message);
  }

  if (err instanceof Error) {
    return message.error(err.message);
  }

  return message.error("Something went wrong");
};

export default clientCatchError;
>>>>>>> 28ec0c03fa8749f0a6e22af9582120c326f74948
