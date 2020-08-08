import React from "react";
import { Layout, Affix } from "antd";
import logo from "./assets/logo.jpg";

const { Header } = Layout;

export const AppHeaderSkeleton = () => {
  return (
    <Affix offsetTop={0} className="app__affix-header">
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <img src={logo} alt="App logo" />
          </div>
        </div>
      </Header>
    </Affix>
  );
};
