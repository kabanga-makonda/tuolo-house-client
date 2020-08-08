import React, { FC } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { Layout, Typography, Button, Col, Row } from "antd";
import { HomeHero, HomeListings, HomeListingsSkeleton } from "./components";
import mapBackground from "./assets/map-background.jpg";
import sanFranciscoImage from "./assets/san-francisco.jpg";
import cancunImage from "./assets/cancun.jpg";
import { displayErrorMessage } from "../../lib/utils";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import {
  ListingsVariables,
  Listings as ListingsData,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { useQuery } from "react-apollo";
import { LISTINGS } from "../../lib/graphql";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home: FC<RouteComponentProps> = ({ history }) => {
  const { data, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
    }
  );

  const onSearch = (value: string) => {
    const trimmendValue = value.trim();
    if (trimmendValue) {
      history.push(`/listings/${trimmendValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />
      <div className="home__cta-section">
        <Title className="home__cta-section-title" level={2}>
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          location.
        </Paragraph>
        <Link
          className="home__cta-section-button"
          to="/listings/united%20states"
        >
          <Button type="primary">Popular listings in the United States</Button>
        </Link>
      </div>
      {renderListingsSection()}

      <div className="home__listings">
        <Title className="home__listings-title" level={4}>
          Listing of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20francisco">
              <div className="home__listings-img-cover">
                <img
                  className="home__listings-img"
                  src={sanFranciscoImage}
                  alt="San Francisco"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancun">
              <div className="home__listings-img-cover">
                <img
                  className="home__listings-img"
                  src={cancunImage}
                  alt="Cancun"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
