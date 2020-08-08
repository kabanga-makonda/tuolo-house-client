import React, { FC } from "react";
import moment, { Moment } from "moment";
import { Button, Card, Divider, Typography, DatePicker } from "antd";
import { formatListingPrice, displayErrorMessage } from "../../../../lib/utils";
import { Viewer, BookingsIndex } from "../../../../lib/types";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";

interface Props {
  host: Listing["listing"]["host"];
  viewer: Viewer;
  price: number;
  bookingsIndex: Listing["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (date: Moment | null) => void;
  setCheckOutDate: (date: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Title, Text } = Typography;

export const ListingCreateBooking: FC<Props> = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  viewer,
  host,
  bookingsIndex,
  setModalVisible,
}) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);
  const dateIsBooked = (currentDate: Moment | null) => {
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const day = moment(currentDate).date();

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disabledDate = (currentDate: Moment | null) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
      return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedDate: Moment | null) => {
    if (checkInDate && selectedDate) {
      if (moment(selectedDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book date of check out to be prior to check in!`
        );
      }
      let dateCursor = checkInDate;
      while (moment(dateCursor).isBefore(selectedDate, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");

        const year = moment(dateCursor).year();
        const month = moment(dateCursor).month();
        const day = moment(dateCursor).date();

        if (
          bookingsIndexJSON[year] &&
          bookingsIndexJSON[year][month] &&
          bookingsIndexJSON[year][month][day]
        ) {
          return displayErrorMessage(
            "You can't book a period of time that overlaps existing bookings. Please try again!"
          );
        }
      }
    }
    setCheckOutDate(selectedDate);
  };

  const viewerIsHost = viewer.id === host.id;
  const checkInDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
  const checkOutDisabled = !checkInDate || checkInDisabled;
  const buttonDisabled = checkInDisabled || !checkInDate || !checkOutDate;

  let buttonMessage = "You won't be charge yet";
  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book a listing!";
  } else if (viewerIsHost) {
    buttonMessage = "You can't booking your own listing!";
  } else if (!host.hasWallet) {
    buttonMessage =
      "The host has diconnected from Stripe and thus won't be able to receive payment!";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title className="listing-booking__card-title" level={2}>
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabled={checkInDisabled}
              disabledDate={disabledDate}
              onChange={(dateValue) => {
                setCheckInDate(dateValue);
              }}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabledDate={disabledDate}
              disabled={checkOutDisabled}
              onChange={(dateValue) => {
                verifyAndSetCheckOutDate(dateValue);
              }}
            />
          </div>
        </div>
        <Divider />
        <Button
          className="listing-booking__card-cta"
          size="large"
          type="primary"
          disabled={buttonDisabled}
          onClick={() => setModalVisible(true)}
        >
          Request to book!
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
};
