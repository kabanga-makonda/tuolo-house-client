import React, { useEffect, useRef, FC } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Layout, Spin } from "antd";
import { useMutation } from "react-apollo";
import {
  ConnectStripe,
  ConnectStripeVariables,
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { CONNECT_STRIPE } from "../../lib/graphql";
import { Viewer } from "../../lib/types";
import { displaySuccessNotification } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const Stripe: FC<Props & RouteComponentProps> = ({
  viewer,
  setViewer,
  history,
}) => {
  const [connectStripe, { data, loading }] = useMutation<
    ConnectStripe,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        displaySuccessNotification(
          "You successfully connect your Stripe account!",
          "You can now begin to create listings in the Host page."
        );
      }
    },
    onError: (error) => {
      history.replace(`/user/${viewer.id}?stripe_error=true`);
      console.error(error);
    },
  });

  const connectStripeRef = useRef(connectStripe);
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code },
        },
      });
    } else {
      history.replace("/login");
    }
  }, [history]);

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connecting your stripe account..." />
      </Content>
    );
  }

  if (data && data.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  return null;
};
