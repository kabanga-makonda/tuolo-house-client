import React, { FC, Fragment } from "react";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Typography, Card, Divider, Button, Tag } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Icon } from "../../../../lib/components";
import {
  formatListingPrice,
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";
import { useMutation } from "react-apollo";
import { DisconnectStripe } from "../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe";
import { DISCONNECT_STRIPE } from "../../../../lib/graphql";
import { Viewer } from "../../../../lib/types";

interface Props {
  user: User["user"];
  viewer: Viewer;
  viewerIsUser: boolean;
  setViewer: (viewer: Viewer) => void;
  handleUserRefecth: () => Promise<void>;
}

const stripAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;

const { Paragraph, Text, Title } = Typography;

export const UserProfile: FC<Props> = ({
  user,
  viewerIsUser,
  viewer,
  setViewer,
  handleUserRefecth,
}) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripe>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          displaySuccessNotification(
            "You've successfully disconnected from Stripe!",
            "You'll have to connect with Stripe to continue to create listings."
          );
          handleUserRefecth();
        }
      },
      onError: () => {
        displayErrorMessage(
          "Sorry!, We weren't able to disconnect you from Stripe. Please try again later!"
        );
      },
    }
  );
  const redirectToStripe = () => {
    window.location.href = stripAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <Fragment>
      <Paragraph>
        <Tag color="green">Stripe Registered</Tag>
      </Paragraph>
      <Paragraph>
        Income Earned:{" "}
        <Text strong>
          {user.income ? formatListingPrice(user.income) : `$0`}
        </Text>
      </Paragraph>
      <Button
        className="user-profile__details-cta"
        type="primary"
        loading={loading}
        onClick={() => disconnectStripe()}
      >
        Disconect Stripe
      </Button>
      <Paragraph type="secondary">
        By disconnecting, you won't be able to receive{" "}
        <Text strong>any further payments</Text>. This will prevent users from
        booking listings that you might have already created.
      </Paragraph>
    </Fragment>
  ) : (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Paragraph>
          Interested in becoming a TuoloHouse host? Register with your Stripe
          account!
        </Paragraph>
        <Button
          className="user-profile__details-cta"
          size="large"
          type="primary"
          icon={<Icon type="iconstripe" />}
          onClick={redirectToStripe}
        >
          Connect with Stripe!
        </Button>
        <Paragraph type="secondary">
          TuoloHouse uses{" "}
          <a
            href="https://stripe.com"
            target="_black"
            rel="noopener noreferrer"
          >
            Stripe
          </a>{" "}
          to help transfer your earnings in a secure and truster manner.
        </Paragraph>
      </div>
    </Fragment>
  );

  const additionalDetailsSection = viewerIsUser ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        {additionalDetails}
      </div>
    </Fragment>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong={true}>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong={true}>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
