import { FC } from "react";

interface ErrorInterface {
  message?: string;
}

const ErrorMessage: FC<ErrorInterface> = ({
  message = "Failed to fetch data retrieng...",
}) => {
  return <h1 className="text-rose-500 font-medium">{message}</h1>;
};

export default ErrorMessage;
