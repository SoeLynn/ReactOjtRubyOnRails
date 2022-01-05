import React, { Fragment } from "react";
import { Table, message, Popconfirm, Button } from "antd";
import I18n from "i18n-js";
import image from "../Images/Screenshot (58).png";
// これからItemTable children state full componentを始めます。
class ItemTable extends React.Component {
  render() {
    const columns = [
      {
        title: I18n.t("item.itemName"),
        dataIndex: "name",
        key: "name",
        // テーブルコラムデータをfilterする。
        ...this.props.filter("name"),
        // テーブルコラムデータをsortingする。
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ["descend", "ascend"],
      },

      {
        title: I18n.t("item.itemPrice"),
        dataIndex: "price",
        key: "price",
        // テーブルコラムデータをfilterする。
        ...this.props.filter("price"),
      },

      {
        title: I18n.t("item.itemSize"),
        dataIndex: "size",
        key: "size_id",
        // テーブルコラムデータをfilterする。
        ...this.props.filter("size"),
        // テーブルコラムデータをsortingする。
        sorter: (a, b) => a.size.localeCompare(b.size),
        sortDirections: ["descend", "ascend"],
      },

      {
        title: I18n.t("item.company"),
        dataIndex: "company",
        key: "company_id",
        // テーブルコラムデータをfilterする。
        ...this.props.filter("company"),
        // テーブルコラムデータをsortingする。
        sorter: (a, b) => a.company.localeCompare(b.company),
        sortDirections: ["descend", "ascend"],
      },

      {
        title: I18n.t("item.itemCountry"),
        dataIndex: "country",
        key: "country",
        // テーブルコラムデータをfilterする。
        ...this.props.filter("country"),
        // テーブルコラムデータをsortingする。
        sorter: (a, b) => a.country.localeCompare(b.country),
        sortDirections: ["descend", "ascend"],
      },

      // {
      //   title: I18n.t("item.itemDate"),
      //   dataIndex: "manafacture_date",
      // },

      {
        title: I18n.t("item.email"),
        dataIndex: "email",
        key: "email",
        // テーブルコラムデータをfilterする。
        ...this.props.filter("email"),
      },

      {
        title: I18n.t("item.remark"),
        dataIndex: "remark",
      },

      {
        title: "写真",
        dataIndex: "image",
        // render: (text, record) => {
        //   return <img src={image} style={{ width: "120%" }} />;
        // },
      },

      {
        title: "",
        key: "action",
        render: (_text, record) => (
          <Fragment>
            {/* アイテムー管理テーブルリストに表示するアイテムデータを消すかどうか確認するconfirm boxを設定する。 */}
            <Popconfirm
              title="削除してもよろしいですか？"
              onConfirm={() => this.props.delete(record.id)}
              okText="はい"
              cancelText="いいえ"
            >
              {/* アイテムー管理テーブルリストに表示するアイテムデータを消すボタン */}
              <Button type="danger"> {I18n.t("common.button.delete")} </Button>
            </Popconfirm>

            {/* 更新したいデータを更新フォームに設定するボタン */}
            <Button
              onClick={() => this.props.edit(record)}
              style={{ marginLeft: 12 }}
              type="primary"
            >
              {I18n.t("common.button.edit")}{" "}
            </Button>
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        {/* 表示テーブル */}
        <Table
          // whiteSpaceがあるデータをwhiteSpaceと一緒に表すためこのstyleを設定する。
          style={{ whiteSpace: "pre" }}
          // テーブルのコラムを設定する。
          columns={columns}
          //　テーブルに表すデータを設定する。
          dataSource={this.props.items}
        />
      </div>
    );
  }
}

export default ItemTable;
