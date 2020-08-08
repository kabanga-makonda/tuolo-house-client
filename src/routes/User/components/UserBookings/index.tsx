import React, { FC } from "react";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Typography, List } from "antd";
import { ListingCard } from "../../../../lib/components";

interface Props {
  userBookings: User["user"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

const { Paragraph, Title, Text } = Typography;

export const UserBookings: FC<Props> = ({
  userBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}) => {
  const total = userBookings ? userBookings.total : null;
  const result = userBookings ? userBookings.result : null;

  const userBookingsList = (
    <List
      grid={{
        gutter: 8,
        column: limit,
        xs: 1,
        sm: 2,
        lg: 4,
      }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "User doesn't have any booking yet!" }}
      pagination={{
        position: "top",
        current: bookingsPage,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page) => setBookingsPage(page),
      }}
      renderItem={(userBookings) => {
        const bookingsHistory = (
          <div className="user-bookings__bookings-history">
            <div>
              Check in : <Text strong>{userBookings.checkIn}</Text>
            </div>
            <div>
              Check out : <Text strong>{userBookings.checkOut}</Text>
            </div>
          </div>
        );
        return (
          <List.Item>
            {bookingsHistory}
            <ListingCard listing={userBookings.listing} />
          </List.Item>
        );
      }}
    />
  );

  const userBookingsElement = userBookingsList ? (
    <div className="user-listings">
      <Title level={4} className="user-listings__title">
        Bookings
      </Title>
      <Paragraph className="user-lsitings__description">
        This section highlights the bookings you've made, and the
        check-in/check-out dates associate with said bookings.
      </Paragraph>
      {userBookingsList}
    </div>
  ) : null;

  return userBookingsElement;
};
