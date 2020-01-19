import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  WhiteSpace,
  WingBlank,
  List,
  InputItem,
  Toast,
  Button
} from "antd-mobile";
import { postData } from "../../utils";

const Item = List.Item;

function useNameList() {
  const [data, setData] = useState([]);

  function updateData() {
    postData("/all").then(({ data }) => {
      data && setData(data);
    });
  }
  return [data, updateData];
}

function Order(props) {
  const [name, setName] = useState("");
  const [nameList, updateNameList] = useNameList([]);

  useEffect(() => {
    updateNameList();
  }, []);

  useEffect(() => {
    setName(localStorage.getItem("username"));
  }, []);

  const onChange = value => {
    window.localStorage.setItem("username", value);
    setName(value);
  };

  const check = value => {
    const isEmpty = !value;
    const isChinese = /^[\u4e00-\u9fa5]+$/.test(value);
    if (isEmpty) {
      Toast.fail("不能为空！");
      return false;
    }
    if (!isChinese) {
      Toast.fail("请输入你的真实姓名！");
      return false;
    }
    return true;
  };

  const handleCommit = () => {
    Toast.loading("Loading...", 0);
    check(name) &&
      postData("/order", { name }).then(data => {
        data && Toast.success(data.msg);
        updateNameList();
      });
  };

  const handleCancel = () => {
    Toast.loading("Loading...", 0);
    check(name) &&
      postData("/cancel", { name }).then(data => {
        data && Toast.success(data.msg);
        updateNameList();
      });
  };

  // const handleClearAll = () => {
  //   Toast.loading("Loading...", 0);
  //   postData("/clearAll", { name }).then(data => {
  //     data && Toast.success(data.msg);
  //     updateNameList();
  //   });
  // }

  return (
    <WingBlank>
      <WhiteSpace />
      <List renderHeader={() => ""}>
        <InputItem
          type="姓名"
          placeholder="请输入你的真实姓名"
          onChange={onChange}
          value={name}
        >
          姓名
        </InputItem>
      </List>
      <WhiteSpace size="lg" />

      <Button onClick={handleCommit} type="primary">
        订餐
      </Button>
      <WhiteSpace />
      <Button onClick={handleCancel} type="warning">
        取消
      </Button>
      {/* <Button onClick={handleClearAll} type="warning">
        清除所有
      </Button> */}
      <WhiteSpace size="lg" />
      <OrderList nameList={nameList} />
    </WingBlank>
  );
}

function OrderList(props) {
  const total = props.nameList.length
  return (
    <List renderHeader={() => `已订餐 ${total} 人`}>
      <Item wrap>
        {total === 0
          ? "无"
          : props.nameList.map(item => item.name).join(", ")}
      </Item>
    </List>
  );
}

Order.propTypes = {};

export default Order;
