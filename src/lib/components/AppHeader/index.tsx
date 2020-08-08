import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Layout, Affix, Input } from "antd";
import { MenuItems } from "./components";
import { Viewer } from "../../types";
import logo from "./assets/logo.jpg";
import { displayErrorMessage } from "../../utils";

const { Header } = Layout;
const { Search } = Input;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
      const { pathname } = location;
      const pathNameSubStrings = pathname.split("/");

      if (!pathname.includes("/listings")) {
        setSearch("");
        return;
      }
      if (pathname.includes("/listings") && pathNameSubStrings.length === 3) {
        setSearch(pathNameSubStrings[2]);
        return;
      }
    }, [location]);

    const onSearch = (value: string) => {
      const timmedValue = value.trim();
      if (timmedValue) {
        history.push(`/listings/${timmedValue}`);
      } else {
        displayErrorMessage("Please enter a valid search!");
      }
    };
    return (
      <Affix offsetTop={0} className="app__affix-header">
        <Header className="app-header">
          <div className="app-header__logo-search-section">
            <div className="app-header__logo">
              <Link to="/">
                <img src={logo} alt="App logo" />
              </Link>
            </div>
            <div className="app-header__search-input">
              <Search
                placeholder="Search 'San Francisco'"
                enterButton
                value={search}
                onChange={(evt) => setSearch(evt.target.value)}
                onSearch={onSearch}
              />
            </div>
          </div>
          <div className="app-header__menu-section">
            <MenuItems viewer={viewer} setViewer={setViewer} />
          </div>
        </Header>
      </Affix>
    );
  }
);
