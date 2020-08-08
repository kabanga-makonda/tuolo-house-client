import React, { FC } from "react";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Typography, List } from "antd";
import { ListingCard } from "../../../../lib/components";

interface Props {
  userListings: User["user"]["listings"];
  listingsPage: number;
  limit: number;
  setListingsPage: (page: number) => void;
}

const { Paragraph, Title } = Typography;

export const UserListings: FC<Props> = ({
  userListings,
  listingsPage,
  limit,
  setListingsPage,
}) => {
  const { total, result } = userListings;
  const userListingsList = (
    <List
      grid={{
        gutter: 8,
        column: 5,
        xs: 1,
        sm: 2,
        lg: 4,
      }}
      dataSource={result}
      locale={{ emptyText: "User doesn't have any listing yet!" }}
      pagination={{
        position: "top",
        current: listingsPage,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page) => setListingsPage(page),
      }}
      renderItem={(userListing) => (
        <List.Item>
          <ListingCard listing={userListing} />
        </List.Item>
      )}
    />
  );
  return (
    <div className="user-listings">
      <Title level={4} className="user-listings__title">
        Listings
      </Title>
      <Paragraph className="user-lsitings__description">
        This section highlights the listings this user currently hosts and has
        made available for bookings.
      </Paragraph>
      {userListingsList}
    </div>
  );
};
