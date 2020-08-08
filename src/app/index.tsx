import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  User,
  Stripe,
} from "../routes";
import { AppHeader, AppHeaderSkeleton, ErrorBanner } from "../lib/components";
import { Layout, Spin } from "antd";
import { Viewer } from "../lib/types";
import { LOG_IN } from "../lib/graphql/mutations";
import {
  LogIn,
  LogInVariables,
} from "../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { useMutation } from "react-apollo";

const initialVievier: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

export const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialVievier);

  const [logIn, { error }] = useMutation<LogIn, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Lauching TouloHouse" />
        </div>
      </Layout>
    );
  }
  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  const stripePromise = loadStripe(
    `${process.env.REACT_APP_S_PUBLISHABLE_KEY}`
  );

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <AppHeader viewer={viewer} setViewer={setViewer} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/host"
            render={(props) => <Host {...props} viewer={viewer} />}
          />
          <Route
            exact
            path="/listing/:id"
            render={(props) => (
              <Elements stripe={stripePromise}>
                <Listing {...props} viewer={viewer} />
              </Elements>
            )}
          />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} setViewer={setViewer} viewer={viewer} />
            )}
          />
          <Route
            exact
            path="/stripe"
            render={(props) => (
              <Stripe {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => (
              <User {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};
