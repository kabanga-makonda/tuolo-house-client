import React, { FC, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Card, Layout, Typography, Button, Spin } from "antd";
import { useApolloClient, useMutation } from "react-apollo";
import { Icon, ErrorBanner } from "../../lib/components/";
import { Viewer } from "../../lib/types";
import { AUTH_URL } from "../../lib/graphql/queries";
import { AuthUrl } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
  LogIn,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login: FC<Props> = ({ setViewer, viewer }) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogIn, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        sessionStorage.setItem("token", data.logIn.token);
        displaySuccessNotification("You have successfully logged in!");
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrl>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  if (viewer.id) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card" style={{ width: 350 }}>
        <div className="log-in-card_intro">
          <Title className="log-in-card__intro-title" level={3}>
            <span role="img" aria-label="wave">
              <Icon type="iconwaveicon" />
            </span>
          </Title>
          <Title className="log-in-card__intro-title" level={3}>
            Log in to TuoloHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <Button
          className="log-in-card__google-button"
          icon={<Icon type="icongoogle" />}
          size="large"
          onClick={() => handAuthorize()}
        >
          Sign in with Google
        </Button>
        <div className="log-in-card__google-button-text">
          <Text type="secondary">
            Note: By signing in, you'll be redirected to the Google consent form
            to sign in with your Google account.
          </Text>
        </div>
      </Card>
    </Content>
  );
};
