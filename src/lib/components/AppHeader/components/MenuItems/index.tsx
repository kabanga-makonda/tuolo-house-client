import React, { FC } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, Menu, Avatar } from "antd";
import { Icon } from "../../../../components";
import { Link } from "react-router-dom";
import { Viewer } from "../../../../types";
import { LOG_OUT } from "../../../../graphql/mutations";
import { LogOut } from "../../../../graphql/mutations/LogOut/__generated__/LogOut";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
const { Item, SubMenu } = Menu;

export const MenuItems: FC<Props> = ({ viewer, setViewer }) => {
  const [logOut] = useMutation<LogOut>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfully logged out!");
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later!"
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item
          key="/user"
          icon={
            <Link to={`/user/${viewer.id}`}>
              <Icon type="iconuser" style={{ fontSize: "20px" }} />
              Profile
            </Link>
          }
        />
        <Item
          key="/logout"
          icon={
            <div onClick={handleLogOut}>
              <Icon type="iconlogout" />
              Log out
            </div>
          }
        />
      </SubMenu>
    ) : (
      <Item
        key="/login"
        style={{ marginRight: 8, marginLeft: 8 }}
        icon={
          <Link to="/login">
            <Button type="primary">Sign In</Button>
          </Link>
        }
      />
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item
        style={{ marginRight: 4, marginLeft: 4 }}
        key="/host"
        icon={
          <Link to="/host">
            <Icon type="iconhome1" />
            Host
          </Link>
        }
      />
      {subMenuLogin}
    </Menu>
  );
};
