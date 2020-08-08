import React, { FC, useState, useEffect, useRef } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { Layout, List, Typography, Affix } from "antd";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import {
  Listings as ListingData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingCard, ErrorBanner } from "../../lib/components";
import { useQuery } from "react-apollo";
import { LISTINGS } from "../../lib/graphql";
import { ListingsSkeleton, ListingsPagination } from "./components";

interface MatchParams {
  location: string;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 8;

export const Listings: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const loacationRef = useRef(match.params.location);
  const [filter, setFilter] = useState<ListingsFilter>(
    ListingsFilter.PRICE_LOW_TO_HIGH
  );
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<ListingData, ListingsVariables>(
    LISTINGS,
    {
      skip: loacationRef.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page,
      },
    }
  );

  useEffect(() => {
    setPage(1);
    loacationRef.current = match.params.location;
  }, [match.params.location]);

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <div>
            <ListingsPagination
              filter={filter}
              setFilter={setFilter}
              total={listings.total}
              page={page}
              limit={PAGE_LIMIT}
              setPage={setPage}
            />
          </div>
        </Affix>
        <List
          grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have yet been created for{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create a{" "}
          <Link to="/host">listing in this area</Link>!
        </Paragraph>
      </div>
    );

  const listingRegionElement = listingsRegion ? (
    <Title className="listings__title" level={3}>
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner
          description="We either couldn't find anything matching your 
        search or have encountered an error. If you are searching for a 
        unique location, try again with more common keywords."
        />
        <ListingsSkeleton />
      </Content>
    );
  }
  return (
    <Content className="listings">
      {listingRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
