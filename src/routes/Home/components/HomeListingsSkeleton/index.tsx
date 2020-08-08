import React from "react";
import { Card, List, Skeleton } from "antd";

import listingLoadingCardCover from "../../assets/listing-loading-card-cover.jpg";

export const HomeListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}];

  return (
    <div className="home-listings-skeleton">
      <Skeleton paragraph={{ rows: 0 }} />
      <List
        grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              className="home-listings-skeleton__card"
              cover={
                <div
                  className="home-listings-skeleton__card-cover-img"
                  style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                ></div>
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
