import React, { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import I18n from "i18n-js";
import axios from "axios";
const UserForm = () => {
  // モーダルフォームの管理
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onFinish = (user) => {
    console.log("Success user:", user);
    if (user.password == user.re_password) {
      axios
        .post("/api/v1/user", { user }, { withCredentials: true })
        .then((response) => {
          // 成功するメッセージを表示する。
          message.success(response.data.successMessage);
        });
    }
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={I18n.t("user.userName")}
          name="user_name"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item
          label={I18n.t("user.email")}
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
          <Input style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item
          label={I18n.t("user.role")}
          name="role"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Select defaultValue="一つ選択してください" style={{ width: "60%" }}>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={I18n.t("user.password")}
          name="password"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Input.Password style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item
          label={I18n.t("user.rePassword")}
          name="re_password"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Input.Password style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {I18n.t("button.register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UserForm;
