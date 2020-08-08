import React from "react";
import { Card, List, Skeleton } from "antd";

import listingLoadingCardCover from "../../assets/listing-loading-card-cover.jpg";

const { Item } = List;

export const ListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div>
      <Skeleton paragraph={{ rows: 1 }} />
      <List
        grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <Item>
            <Card
              className="listings-skeleton__card"
              loading
              cover={
                <div
                  className="listings-skeleton__card-cover-img"
                  style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                ></div>
              }
            />
          </Item>
        )}
      />
    </div>
  );
};
