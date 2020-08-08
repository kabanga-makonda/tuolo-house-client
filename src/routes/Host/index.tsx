import React, { FC, useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  Button,
} from "antd";

import { Viewer } from "../../lib/types";
import { Link, Redirect } from "react-router-dom";
import { ListingType } from "../../lib/graphql/globalTypes";
import { Icon } from "../../lib/components";
import {
  iconColor,
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";
import { UploadChangeParam } from "antd/lib/upload";
import { Store } from "antd/lib/form/interface";
import { useMutation } from "react-apollo";
import {
  HostListing,
  HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
import { HOST_LISTINGS } from "../../lib/graphql";

export interface FormListing {
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  numOfGuests: number;
}
interface Props {
  viewer: Viewer;
}
const { Content } = Layout;
const { Item } = Form;
const { Text, Title } = Typography;

export const Host: FC<Props> = ({ viewer }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  const [hostLinting, { loading, data }] = useMutation<
    HostListing,
    HostListingVariables
  >(HOST_LISTINGS, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }
    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const handleHostListingSuccess = (values: Store) => {
    const listing: FormListing = {
      ...(values as FormListing),
      image: imageBase64Value as string,
    };
    const fullAddress = `${listing.address}, ${listing.city}, ${listing.state}, ${listing.zip}`;
    const input = {
      title: listing.title,
      description: listing.description,
      image: listing.image,
      type: listing.type,
      address: fullAddress,
      price: listing.price * 100,
      numOfGuests: listing.numOfGuests,
    };
    hostLinting({
      variables: {
        input,
      },
    });
  };

  const handleHostListingFailed = () => {
    displayErrorMessage("Please complete all required form fields!");
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">login</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We're creating your listing now.</Text>
        </div>
      </Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form
        name="host__form"
        layout="vertical"
        onFinish={handleHostListingSuccess}
        onFinishFailed={handleHostListingFailed}
      >
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi, Let's get start listing your place.
          </Title>
          <Text type="secondary">
            In this form, we will collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Item
          label="Home Type"
          name="type"
          rules={[{ required: true, message: "Please select a home type!" }]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <Icon
                type="iconhouse1"
                style={{ fontSize: "20px", color: iconColor }}
              />
              <span> Apartment </span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <Icon
                type="iconhome1"
                style={{ fontSize: "20px", color: iconColor }}
              />
              <span> House </span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label="Max # of Guests"
          name="numOfGuests"
          rules={[
            { required: true, message: "Please enter a max number of guests!" },
          ]}
        >
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          label="Title"
          extra="Max character count of 45"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a title for your listing!",
            },
          ]}
        >
          <Input
            maxLength={45}
            placeholder="The iconic and lixurious Bel-Air mansion"
          />
        </Item>

        <Item
          label="Description of listing"
          extra="Max character count of 400"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a description for your listing!",
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air Los Angeles"
          />
        </Item>

        <Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter an address for your listing!",
            },
          ]}
        >
          <Input placeholder="1 Avenue Paul Langevin" />
        </Item>

        <Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: "Please enter a city or region for your listing!",
            },
          ]}
        >
          <Input placeholder="Lille" />
        </Item>

        <Item
          label="State/Province"
          name="state"
          rules={[
            {
              required: true,
              message: "Please enter a state or province for your listing!",
            },
          ]}
        >
          <Input placeholder="Nord" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="zip"
          rules={[
            {
              required: true,
              message: "Please enter a zip code for your listing!",
            },
          ]}
        >
          <Input placeholder="59000" />
        </Item>

        <Item
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          name="image"
          rules={[
            {
              required: true,
              message: "Please enter an image for your listing!",
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="file"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt="Listing" />
              ) : (
                <div>
                  <Icon
                    spin={imageLoading}
                    type={imageLoading ? "iconloading" : "iconplus"}
                  />
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter a price for your listing!",
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File): boolean => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1048576 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size!"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};
