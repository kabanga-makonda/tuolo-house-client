import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, Tag, Typography } from "antd";
import { Icon } from "../../../../lib/components";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { iconColor } from "../../../../lib/utils";

interface Props {
  listing: ListingData["listing"];
}

const { Paragraph, Title } = Typography;

export const ListingDetails: FC<Props> = ({ listing }) => {
  return (
    <div className="listing-details">
      <div
        className="listing-details__image"
        style={{ backgroundImage: `url(${listing.image})` }}
      />

      <div className="listing-details__information">
        <Paragraph
          className="listing-details__city-address"
          type="secondary"
          ellipsis
        >
          <Link to={`/listings/${listing.city}`}>
            <Icon type="iconenvironment" style={{ color: iconColor }} />{" "}
            {listing.city}
          </Link>

          <Divider type="vertical" />

          {listing.address}
        </Paragraph>
        <Title className="listing-details__title" level={3}>
          {listing.title}
        </Title>
      </div>

      <Divider />

      <div className="listing-details__section">
        <Link to={`/user/${listing.host.id}`}>
          <Avatar src={listing.host.avatar} size={64} />
          <Title className="listing-details__host-name">
            {listing.host.name}
          </Title>
        </Link>
      </div>

      <Divider />

      <div className="listing-details__section">
        <Title level={4}>About this space</Title>
        <div className="listing-details__about-items">
          <Tag color="magenta">{listing.type}</Tag>
          <Tag color="magenta">{listing.numOfGuests} Guests</Tag>
        </div>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {listing.description}
        </Paragraph>
      </div>
    </div>
  );
};
