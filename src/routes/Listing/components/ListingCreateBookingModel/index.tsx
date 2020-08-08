import React, { FC } from "react";
import { Modal, Button, Divider, Typography } from "antd";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import moment, { Moment } from "moment";
import { Icon } from "../../../../lib/components";
import {
  formatListingPrice,
  displayErrorMessage,
  displaySuccessNotification,
} from "../../../../lib/utils";
import { useMutation } from "react-apollo";
import {
  CreateBooking,
  CreateBookingVariables,
} from "../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking";
import { CREATE_BOOKING } from "../../../../lib/graphql";

interface Props {
  id: string;
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal: FC<Props> = ({
  id,
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
  clearBookingData,
  handleListingRefetch,
}) => {
  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const stripe = useStripe();
  const elements = useElements();

  const [createBooking, { loading }] = useMutation<
    CreateBooking,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've succefully booked the listing.",
        "Booking history can always be found in your User page."
      );
      handleListingRefetch();
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to successfully book the listing. Please try again later!"
      );
    },
  });

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      return displayErrorMessage(
        "Sorry! We weren't able to connect with Stripe"
      );
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return displayErrorMessage(
        "Sorry! We weren't able to get your payment information"
      );
    }
    const result = await stripe.createToken(card);
    if (result.error) {
      displayErrorMessage(
        result.error.message && result.error.message
          ? result.error.message
          : "Sorry!, We weren't able to book the listing. Please try again later."
      );
      return;
    } else {
      createBooking({
        variables: {
          input: {
            id,
            source: result.token?.id as string,
            checkIn: checkInDate.format("YYYY-MM-DD"),
            checkOut: checkOutDate.format("YYYY-MM-DD"),
          },
        },
      });
    }
  };

  const listingPrice = price * daysBooked;
  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <Icon type="iconkey" />
          </Title>
          <Title className="listing-booking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text strong mark>
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            and{" "}
            <Text strong mark>
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            className="listing-booking-modal__stripe-card"
            options={{ hidePostalCode: true }}
          />
          <Button
            className="listing-booking-modal__cta"
            size="large"
            type="primary"
            htmlType="submit"
            onClick={handleCreateBooking}
            disabled={!stripe && !elements}
            loading={loading}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
