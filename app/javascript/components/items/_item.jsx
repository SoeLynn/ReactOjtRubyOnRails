import React from "react";
import { Breadcrumb, Layout, message, Input, Button, Space } from "antd";
import I18n from "i18n-js";
import "../../bundles/i18n/ja.js";
import SideBar from "../home/_sideBar";
import ItemTable from "./_item_table.jsx";
import ItemForm from "./_item_form.jsx";
import axios from "axios";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import validator from "validator";
//import image from "../Images/Screenshot (58).png";
// import moment from "moment";
import * as wjcXlsx from "@grapecity/wijmo.xlsx";
const { Content } = Layout;
// これからItem Parent state full componentを始めます。
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.saveExcelFile = this.saveExcelFile.bind(this);
    this.exportReport = this.exportReport.bind(this);
    this.state = {
      items: [],
      size: [],
      company: [],
      excelData: [],
      searchText: "",
      searchedColumn: "",
      successMessage: null,
    };
  }

  // 一覧の画面にリストのデータを表示条件
  componentDidMount() {
    // Stateの中でのVariableをクリアする。
    this.setState({
      items: [],
      size: [],
      company: [],
      excelData: [],
      searchText: "",
      searchedColumn: "",
    });
    axios
      .get("api/v1/item.json")
      .then((response) => {
        console.log("response data", response.data);
        this.setState(() => ({
          size: response.data.sizes,
        }));

        // popup データを表示するため設定する。
        response.data.companies.forEach((companyData) => {
          const newCompany = {
            key: companyData.id,
            id: companyData.id,
            company_name: companyData.company_name,
          };
          this.setState((prevState) => ({
            company: [...prevState.company, newCompany],
          }));
        });
        // 一覧の画面のアイテムテーブルリストに表示するため設定する。
        response.data.items.forEach((item) => {
          const newItem = {
            key: item.item_id,
            id: item.item_id,
            name: item.name,
            price: item.price,
            size: item.size,
            company: item.company_name,
            country: item.country,
            email: item.email,
            company_id: item.company_id,
            remark: item.remark,
            size_id: item.size_id,
            image: (
              <img
                src={require(`../Images/${item.image}`)}
                style={{ width: "150%" }}
              />
            ),
          };
          this.setState((prevState) => ({
            items: [...prevState.items, newItem],
          }));
        });
      })
      .catch((error) => console.log(error));
  }

  // フォームクリア機能
  clearForm() {
    this.formRef.current?.setFieldsValue({
      id: null,
      name: null,
      price: null,
      size_id: "一つ選択してください",
      country: null,
      company_name: null,
      email: null,
      remark: null,
      company_id: null,
    });
  }

  // データの挿入と更新
  onFinish = (item) => {
    console.log("front image file..... = ", item.image.originFileObj);
    // 挿入条件と更新条件の管理
    // アイテムフォームにitemのidがない場合は 挿入条件をします。
    item.name = validator.trim(item.name);
    item.image = item.image.name;
    item.imageFile = item.image.originFileObj;
    if (item.id == undefined) {
      // 重複チェックをする機能
      if (
        this.state.items.find(
          (stateItem) =>
            stateItem.name === item.name &&
            stateItem.price === item.price &&
            stateItem.country === item.country &&
            stateItem.size_id === item.size_id &&
            stateItem.company_id === item.company_id
        )
      ) {
        // エラーメッセージを表示する。
        message.warning(I18n.t("message.duplicate_error"));
        this.clearForm();
      } else {
        axios.post("/api/v1/item", { item }).then((response) => {
          // 一覧のテーブルのデータをリロードする。
          this.componentDidMount();
          // 成功するメッセージを表示する。
          message.success(response.data.successMessage);
          // アイテムフォームフィールドをクリアする。
          this.clearForm();
        });
      }
    }
    // アイテムフォームにitemのidがある場合は 更新条件をします。
    // 更新条件
    else {
      axios
        .post(`/api/v1/item/update/${item.id}`, { item })
        .then((response) => {
          if (response.data.errors) {
            // エラーメッセージを表示する。
            message.warning(response.data.errors);
          } else {
            // 一覧のテーブルのデータをリロードする。
            this.componentDidMount();
            // 成功するメッセージを表示する。
            message.success(response.data.successMessage);
            // アイテムフォームフィールドをクリアする。
            this.clearForm();
          }
        });
    }
  };

  // 削除条件
  deleteItem = (id) => {
    axios.delete(`api/v1/items/${id}`).then((response) => {
      if (response.data.errors) {
        // エラーメッセージを表示する。
        message.warning(response.data.errors);
      } else {
        //　 削除条件が成功する場合テーブルのデータをリロードしないで表示する。
        this.setState({
          items: this.state.items.filter((item) => item.key !== id),
        });
        // 成功するメッセージを表示する。
        message.success(response.data.successMessage);
      }
    });
  };

  // 提出されたデータをフォームに設定するため使用する。
  formRef = React.createRef();
  // 更新したいデータを更新フォームに設定します。
  edit = (record) => {
    this.formRef.current?.setFieldsValue({
      id: record.id,
      name: record.name,
      price: record.price,
      size_id: record.size_id,
      company_name: record.company,
      country: record.country,
      email: record.email,
      remark: record.remark,
      company_id: record.company_id,
    });
  };

  // データのフィルタリングと検索する機能
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        {/* 検索するため入力フィールド */}
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`検索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          {/* 検索するボタン */}
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            検索
          </Button>

          {/* リセットするボタン */}
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            リセット
          </Button>

          {/* フィルターするボタン */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            フィルター
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // 検索するボタンを押す時作業する機能
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  // リセットするボタンを押す時作業する機能
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  //　Excelファイルを出す機能
  saveExcelFile() {
    const workbook = this.exportReport(this.state.items);
    // Excel出力した後、ファイル名を設定する
    var today = new Date(),
      date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "-" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();
    // ItemDataReportという名前でExcel出力する
    workbook.saveAsync("ItemDataReport" + date + ".xlsx");
  }

  // Excelファイルの管理
  exportReport(items) {
    var itemData = new wjcXlsx.Workbook();

    var stdNumWidth = 85,
      tableHeaderStyle = new wjcXlsx.WorkbookStyle(),
      tableValueStyle = new wjcXlsx.WorkbookStyle(),
      tableDateStyle = new wjcXlsx.WorkbookStyle();

    tableHeaderStyle.font = new wjcXlsx.WorkbookFont();
    tableHeaderStyle.font.bold = true;
    tableHeaderStyle.fill = new wjcXlsx.WorkbookFill();
    tableHeaderStyle.fill.color = "#fad9cd";
    tableValueStyle.fill = new wjcXlsx.WorkbookFill();
    tableValueStyle.fill.color = "#f4b19b";
    tableDateStyle.basedOn = tableValueStyle;

    var sheet = new wjcXlsx.WorkSheet(),
      rows = sheet.rows;

    // Excelフィールドのシートを設定する。
    itemData.sheets.push(sheet);
    sheet.name = "アイテムデータ";

    sheet.columns[0] = new wjcXlsx.WorkbookColumn();
    sheet.columns[0].width = "1ch";
    sheet.columns[1] = new wjcXlsx.WorkbookColumn();
    sheet.columns[1].width = 100;
    sheet.columns[2] = new wjcXlsx.WorkbookColumn();
    sheet.columns[2].width = stdNumWidth;
    sheet.columns[3] = new wjcXlsx.WorkbookColumn();
    sheet.columns[3].width = 200;
    sheet.columns[4] = new wjcXlsx.WorkbookColumn();
    sheet.columns[4].width = stdNumWidth;
    sheet.columns[6] = new wjcXlsx.WorkbookColumn();
    sheet.columns[6].width = 120;
    sheet.columns[6] = new wjcXlsx.WorkbookColumn();
    sheet.columns[6].width = stdNumWidth;
    sheet.columns[7] = new wjcXlsx.WorkbookColumn();
    sheet.columns[7].width = stdNumWidth;
    sheet.columns[8] = new wjcXlsx.WorkbookColumn();
    sheet.columns[8].width = 130;

    //　タイトルを設定する。
    rows[0] = new wjcXlsx.WorkbookRow();
    rows[0].cells[1] = new wjcXlsx.WorkbookCell();
    rows[0].cells[1].colSpan = 2;
    rows[0].cells[1].value = "アイテムデータ";
    rows[0].cells[1].style = new wjcXlsx.WorkbookStyle();
    rows[0].cells[1].style.basedOn = tableHeaderStyle;
    rows[0].cells[1].style.font = new wjcXlsx.WorkbookFont();
    rows[0].cells[1].style.font.size = 30;
    // rows[0].cells[1].style.font.italic = true;

    // テーブルのコラム名を設定する。
    rows[2] = new wjcXlsx.WorkbookRow();
    rows[2].style = new wjcXlsx.WorkbookStyle();
    rows[2].style.hAlign = wjcXlsx.HAlign.Center;
    rows[2].cells[1] = new wjcXlsx.WorkbookCell();
    rows[2].cells[1].value = "項目名";
    rows[2].cells[1].style = tableHeaderStyle;
    rows[2].cells[2] = new wjcXlsx.WorkbookCell();
    rows[2].cells[2].value = "アイテム価格";
    rows[2].cells[2].style = tableHeaderStyle;
    rows[2].cells[3] = new wjcXlsx.WorkbookCell();
    rows[2].cells[3].value = "アイテムサイズ";
    rows[2].cells[3].style = tableHeaderStyle;
    rows[2].cells[4] = new wjcXlsx.WorkbookCell();
    rows[2].cells[4].value = "製造会社";
    rows[2].cells[4].style = tableHeaderStyle;
    rows[2].cells[5] = new wjcXlsx.WorkbookCell();
    rows[2].cells[5].value = "製造国";
    rows[2].cells[5].style = tableHeaderStyle;
    rows[2].cells[6] = new wjcXlsx.WorkbookCell();
    rows[2].cells[6].value = "メール";
    rows[2].cells[6].style = tableHeaderStyle;
    rows[2].cells[7] = new wjcXlsx.WorkbookCell();
    rows[2].cells[7].value = "リマーク";
    rows[2].cells[7].style = tableHeaderStyle;

    // スタートしたいライン = 4
    var firstIdx = 3;

    // テーブルのデータを設定する。
    for (var i = 0; i < items.length; i++) {
      var item = items[i],
        rowIdx = firstIdx + i;
      rows[rowIdx] = new wjcXlsx.WorkbookRow();
      rows[rowIdx].cells[1] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[1].value = item.name;
      rows[rowIdx].cells[1].style = tableValueStyle;
      rows[rowIdx].cells[2] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[2].value = item.price;
      rows[rowIdx].cells[2].style = tableDateStyle;
      rows[rowIdx].cells[3] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[3].value = item.size;
      rows[rowIdx].cells[3].style = tableDateStyle;
      rows[rowIdx].cells[4] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[4].value = item.company;
      rows[rowIdx].cells[4].style = tableDateStyle;
      rows[rowIdx].cells[5] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[5].value = item.country;
      rows[rowIdx].cells[5].style = tableDateStyle;
      rows[rowIdx].cells[6] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[6].value = item.email;
      rows[rowIdx].cells[6].style = tableDateStyle;
      rows[rowIdx].cells[7] = new wjcXlsx.WorkbookCell();
      rows[rowIdx].cells[7].value = item.remark;
      rows[rowIdx].cells[7].style = tableDateStyle;
    }

    return itemData;
  }

  exportExcelByRuby() {
    axios.get("api/v1/export_excel.json").then((response) => {
      this.setState({
        excelData: response.data.items,
      });
      wb = xlsx_package.workbook;
      sheet = wb.add_worksheet("Items");
      // Create the header row
      sheet.add_row[("Item Name", "Price")];
      // Create entries for each item
      // @items.each do |item|
      //   sheet.add_row [item.name, item.quantity]
      // end
      for (var i = 0; i < response.data.items.length; i++) {
        sheet.add_row[(response.data.items.name, response.data.items.price)];
      }
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar />
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>{I18n.t("home.home")}</Breadcrumb.Item>
              <Breadcrumb.Item>{I18n.t("home.menu1.side2")}</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {/* 挿入フォームのコンポーネントを呼び出す。 */}
              <ItemForm
                // 挿入と更新機能を呼び出してフォームコンポーネントを形成します。
                onFinish={this.onFinish}
                // 更新したいデータを更新フォームに設定する機能を呼び出してフォームコンポーネントを形成します。
                componentEdit={this.formRef}
                // 挿入と更新のフォームに設定するアイテムサイズマスターデータをフォームコンポーネントへ送る。
                itemSize={this.state.size}
                // 挿入と更新のフォームに設定するアイテムサイズマスターデータをフォームコンポーネントへ送る。
                company={this.state.company}
                //　Excelファイルを出す機能をフォームコンポーネントへ送る。
                excelExport={this.saveExcelFile}
                //　Excelファイルを出す機能をフォームコンポーネントへ送る。
                excelExportByRuby={this.exportExcelByRuby}
              />
              {/* テーブルのコンポーネントを呼び出す。 */}
              <ItemTable
                // アイテムー管理テーブルリストに表示するアイテムデータをテーブルコンポーネントへ送る。
                items={this.state.items}
                // 更新したいデータを更新フォームに設定する機能をテーブルコンポーネントから呼び出す。
                edit={this.edit}
                // アイテムー管理テーブルリストに表示するアイテムデータを消す機能をテーブルコンポーネントから呼び出す。
                delete={this.deleteItem}
                // アイテムー管理テーブルリストに表示するアイテムデータを検索する機能をテーブルコンポーネントから呼び出す。
                filter={this.getColumnSearchProps}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Item;
