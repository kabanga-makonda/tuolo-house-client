import React, { FC } from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../../lib/components";
import { Listings } from "../../../../lib/graphql/queries/Listings/__generated__/Listings";

interface Props {
  title: string;
  listings: Listings["listings"]["result"];
}

const { Title } = Typography;

export const HomeListings: FC<Props> = ({ title, listings }) => {
  return (
    <div className="home-listings">
      <Title className="home-listings__title" level={4}>
        {title}
      </Title>
      <List
        grid={{ gutter: 12, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={listings}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  );
};
