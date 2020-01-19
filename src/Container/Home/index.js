import React from "react";
import PropTypes from "prop-types";
import { List, WhiteSpace, WingBlank, Icon, Result, NoticeBar } from "antd-mobile";
import Order from "../Order";

function Home(props) {
  return (
    <div>
      <WhiteSpace size="lg" />
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          每天 8:40 点开始订餐，9:20 结束。
        </NoticeBar>
      <WhiteSpace size="lg" />
      <Order />
    </div>
  );
}

Home.propTypes = {};

export default Home;
