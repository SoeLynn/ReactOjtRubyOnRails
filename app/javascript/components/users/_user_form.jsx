import React, { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
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
          console.log("user data", response.data.users);
          // 成功するメッセージを表示する。
          message.success(response.data.successMessage);
        });
    }
  };

  const onFinishLogin = (user) => {
    console.log("login user", user);
    axios
      .post("/api/v1/user/login", { user }, { withCredentials: true })
      .then((response) => {
        // console.log("user data", response.data.users);
        // 成功するメッセージを表示する。
        message.success(response.data.successMessage);
      });
    setIsModalVisible(false);
  };

  // モーダルフォームを閉じる機能をする。
  const handleOk = () => {
    setIsModalVisible(false);
  };

  // モーダルフォームを閉じる機能をする
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const login = () => {
    setIsModalVisible(true);
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
          label="Username"
          name="user_name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>

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
          <Input style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="re_password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password style={{ width: "60%" }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>

          <Button type="primary" onClick={login} style={{ marginLeft: "10px" }}>
            Login
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Login User"
        visible={isModalVisible}
        // モーダルフォームを閉じる機能を呼び出す。
        onOk={handleOk}
        // モーダルフォームを閉じる機能を呼び出す。
        onCancel={handleCancel}
        // モーダルフォームのフッターにオーケーボタンを設定する。
        footer={[<Button onClick={handleCancel}>オーケー</Button>]}
      >
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
            <Input style={{ width: "60%" }} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="encrypt_password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password style={{ width: "60%" }} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UserForm;
