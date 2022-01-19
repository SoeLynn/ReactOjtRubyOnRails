import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import I18n from "i18n-js";
import axios from "axios";
const LoginForm = () => {
  const onFinishLogin = (user) => {
    console.log("login user", user);
    axios
      .post("/api/v1/user/login", { user }, { withCredentials: true })
      .then((response) => {
        // 成功するメッセージを表示する。
        // message.success(response.data.userID);
        if (response.data.userId) {
          location.href = "/items";
        } else {
          location.href = "/";
        }
      });
  };

  return (
    <div style={{ padding: 50, minHeight: "300px" }}>
      <h1 style={{ marginLeft: "480px" }}>ユーザーログインフォーム</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinishLogin}
        autoComplete="off"
      >
        <Form.Item
          label={I18n.t("item.email")}
          name="email"
          rules={[
            {
              type: "email",
              message: I18n.t("validation.email"),
            },
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Input style={{ width: "40%" }} />
        </Form.Item>

        <Form.Item
          label="パスワード"
          name="encrypt_password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password style={{ width: "40%" }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {I18n.t("button.login")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginForm;
