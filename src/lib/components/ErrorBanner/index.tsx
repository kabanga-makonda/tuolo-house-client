import React, { FC } from "react";
import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string;
}
export const ErrorBanner: FC<Props> = ({
  message = "Uh oh, Something went wrong :(",
  description = "Look like something went wrong. Please check your connection and/or try again later",
}) => {
  return (
    <Alert banner closable message={message} description={description}></Alert>
  );
};
