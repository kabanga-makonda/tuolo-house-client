import React, { FC } from "react";
import { Link } from "react-router-dom";
import { User_user_listings_result } from "../../graphql/queries/User/__generated__/User";
import { Card, Typography } from "antd";
import { Icon } from "../Icon";
import { iconColor, formatListingPrice } from "../../utils";

interface Props {
  listing: User_user_listings_result;
}
const { Text, Title } = Typography;
export const ListingCard: FC<Props> = ({ listing }) => {
  const { id, title, image, address, price, numOfGuests } = listing;

  return (
    <Link to={`/listing/${id}`}>
      <Card
        hoverable
        cover={
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="listing-card__cover-img"
          />
        }
      >
        <div className="listing-card__details">
          <div className="listing-card__description">
            <Title level={4} className="listing-card__price">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
            <Text strong ellipsis className="listing-card__title">
              {title}
            </Text>
            <Text ellipsis className="listing-card__address">
              {address}
            </Text>
          </div>
          <div className="listing-card__dimensions listing-card__dimensions--guests">
            <Icon
              type="iconuser"
              style={{ color: iconColor, fontSize: "20px" }}
            />
            <Text>{numOfGuests} guests</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};
