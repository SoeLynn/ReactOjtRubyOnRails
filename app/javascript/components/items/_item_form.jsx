import React, { useState, Fragment } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Modal,
  Radio,
  Table,
  Upload,
} from "antd";
import I18n from "i18n-js";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
const { Search } = Input;
// import moment from "moment";
// これからItemForm children functional componentを始めます。
const ItemForm = ({
  onFinish,
  componentEdit,
  itemSize,
  company,
  excelExport,
  excelExportByRuby,
}) => {
  // モーダルフォームの管理
  const [isModalVisible, setIsModalVisible] = useState(false);
  // popupフィールドのテーブルにデータを設定するため新しいvariableを指定する。
  const [tableData, setColumnData] = useState(null);
  // popupの検索するフィールドにvalueを設定する。
  const [search_value, setValue] = useState(null);
  const validateMessages = {
    number: {
      range: "${label} は ${min} と ${max}の間にある必要があります。",
    },
  };
  // popupフィールドのテーブルにデータの中で選んだデータをフォームの社会項目に設定する。
  const onChange = (value) => {
    componentEdit.current?.setFieldsValue({
      company_name: value.company_name,
      company_id: value.id,
    });
    // モーダルフォームを閉じる機能をする。
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

  // companyデータをRadioボタンで管理する。
  const handleSelect = (selectData) => {
    // モーダルフォームを表示する機能をする。
    setIsModalVisible(true);
    // この機能を作業するとpopupフィールドのテーブルにデータを設定する。
    setColumnData(company);
    console.log("table data", tableData);
    // popupフィールドのテーブルにデータの中で選んだデータをフォームの社会項目に設定する。
    setValue(selectData);
    // popupフィールドの設定するデータを検索する。
    handleSearch(selectData);
  };

  // popupフィールドのデータを検索した後結果を保つするためこのarrayを作りました。
  const companies = [];

  // popupフィールドの設定するデータを検索する。
  const handleSearch = (searchData) => {
    // popupの検索するフィールドにvalueを更新すれるように設定する。
    setValue(searchData);
    for (var i = 0; i < company.length; i++) {
      if (
        company[i].company_name
          ?.toLowerCase()
          .includes(searchData.toString()?.toLowerCase())
      ) {
        companies.push(company[i]);
      }
    }
    // popupフィールドのデータを検索した結果をpopupフィールドのテーブルに表示する。
    setColumnData(companies);
  };

  // popupフィールドのデータを検索するため設定する入力フィールド
  const searchField = (
    <Form.Item label={I18n.t("item.company")}>
      <Input
        key="1"
        name="searchData"
        value={search_value}
        onChange={(e) => handleSearch(e.target.value ? [e.target.value] : [])}
      ></Input>
    </Form.Item>
  );

  // popupフィールドの設定するデータテーブルをつくる。
  const columns = [
    {
      title: "アクション",
      key: "action",
      render: (_text, record) => (
        <Fragment>
          <Radio
            value={record.company_id}
            onChange={() => onChange(record)}
          ></Radio>
        </Fragment>
      ),
    },
    {
      title: I18n.t("item.company"),
      dataIndex: "company_name",
      key: "company_id",
    },
  ];

  const normFile = (e) => {
    return e && e.file;
  };

  return (
    <div>
      {/* フォーム設定 */}
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        ref={componentEdit}
        validateMessages={validateMessages}
      >
        {/* 番号フィールドを設定する。 */}
        <Form.Item label=" " name="id" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        {/* アイテム名前フィールドを設定する。 */}
        <Form.Item
          label={I18n.t("item.itemName")}
          name="name"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>

        {/* アイテム価格フィールドを設定する。 */}
        <Form.Item
          label={I18n.t("item.itemPrice")}
          name="price"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
            { type: "number", min: 10000, max: 100000 },
          ]}
        >
          <InputNumber style={{ width: "60%" }} />
        </Form.Item>

        {/* アイテムサイズフィールドを設定する。 */}
        <Form.Item
          label={I18n.t("item.itemSize")}
          name="size_id"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Select defaultValue="一つ選択してください" style={{ width: "60%" }}>
            {itemSize.map((value) => (
              <Select.Option key={value.id} value={value.id}>
                {value.size}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* アイテムの製造国フィールドを設定する。 */}
        <Form.Item
          label={I18n.t("item.itemCountry")}
          name="country"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Input style={{ width: "60%" }} />
        </Form.Item>

        {/* 会社リストフィールドを設定する。 */}
        <Form.Item
          label={I18n.t("item.company")}
          name="company_name"
          rules={[
            {
              required: true,
              message: I18n.t("validation.message"),
            },
          ]}
        >
          <Search
            allowClear
            enterButton="検索"
            size="medium"
            style={{ width: "60%" }}
            onSearch={handleSelect.bind(this)}
          />
        </Form.Item>

        {/* 製造日フィールドを設定する。 */}
        {/* <Form.Item label={I18n.t("item.itemDate")} name="manafacture_date">
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "60%" }}
            placeholder="日付を選択してください"
          />
        </Form.Item> */}

        {/* メールフィールドを設定する。 */}
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

        {/* リマークフィールドを設定する。 */}
        <Form.Item
          label={I18n.t("item.remark")}
          name="remark"
          rules={[
            {
              max: 20,
              message: I18n.t("validation.remark"),
            },
          ]}
        >
          <Input.TextArea style={{ width: "60%", resize: "none" }} />
        </Form.Item>

        <Form.Item
          name="image"
          label="ファイル"
          valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>
              写真を選んでください
            </Button>
          </Upload>
        </Form.Item>

        {/* companiesのテーブルIDを運ぶ */}
        <Form.Item label=" " name="company_id" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        {/* 保存ボタンを設定する。 */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit">
            {I18n.t("common.button.save")}
          </Button>
          {/* Excelファイルを出すボタンを設定する。 */}
          <Button
            style={{ marginLeft: 30 }}
            type="primary"
            htmlType="button"
            onClick={excelExport}
          >
            {I18n.t("common.button.excel-export")}
          </Button>
          {/* Excelファイルを出すボタンを設定する。
          <Button
            style={{ marginLeft: 30 }}
            type="primary"
            htmlType="button"
            onClick={excelExportByRuby}
          >
            {I18n.t("common.button.excel-export")}
          </Button> */}
        </Form.Item>
      </Form>

      {/* ポップアップモーダルを設定する。 */}
      <Modal
        title="会社一連"
        visible={isModalVisible}
        // モーダルフォームを閉じる機能を呼び出す。
        onOk={handleOk}
        // モーダルフォームを閉じる機能を呼び出す。
        onCancel={handleCancel}
        // モーダルフォームのフッターにオーケーボタンを設定する。
        footer={[<Button onClick={handleCancel}>オーケー</Button>]}
      >
        {/* 検索入力フィールドを設定する。 */}
        {searchField}
        <br></br>
        {/* popupに表示するテーブルリストを設定する。 */}
        <Table
          // テーブルのコラムを設定する。
          columns={columns}
          //　テーブルに表すデータを設定する。
          dataSource={tableData}
          //　テーブルのpaginationを一ページに5として設定する。
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default ItemForm;
