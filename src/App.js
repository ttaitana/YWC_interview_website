import React, { PropTypes } from "react"
import {
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Breadcrumb,
  Card,
  Radio,
  Divider,
  Badge,
  Space,
  Button,
  AutoComplete,
  Empty,
  Drawer,
  Layout,
} from "antd"
import Icon, {
  CarOutlined,
  FileDoneOutlined,
  LeftOutlined,
} from "@ant-design/icons"
import { ReactComponent as PetSvg } from "./pet.svg"
import parse from "html-react-parser"
import "antd/dist/antd.css"
import "./index.css"

//! ============== Todo List ==============
//* Basic Structure (desktop view) ✓
//* Fetch Data ✓
//* Change display as category ✓
//* Filter by price (min-max, range select) ✓ (included null to select) ✓
//* Filter by location ✓
//* Filter by Main Category ✓
//* Filter by sub Category (maybe) ✓
//todo : Get Current location
//todo : Responsive (90%) 
//! =======================================

//! define keyword
const generalShopKeyword = ["งานบริการอื่นๆ", "เบ็ดเตล็ด"]
const otopShopKeyword = ["แฟชั่น"]

//! define function
const sortThaiDictionary = (list) => {
  const newList = [...list]
  newList.sort((a, b) => a.localeCompare(b, "th"))
  return newList
}

const priceRangeConvertor = (min, max) => {
  const min_range =
    min === null ? 0 : min <= 100 ? 1 : min <= 300 ? 2 : min <= 600 ? 3 : 4
  const max_range =
    max === null ? 4 : max <= 100 ? 1 : max <= 300 ? 2 : max <= 600 ? 3 : 4
  return [...Array(1 + max_range - min_range).keys()].map((v) => min_range + v)
}

const clearSlash = (text) => {
  let new_text = text.split("/")
  return new_text.length > 1
    ? new_text.map((txt) => txt.replace(/\s/g, ""))
    : text.split(" ")
}

const checkKeyword = (word_list, keywords) => {
  return word_list.filter((word) => keywords.includes(word)).length > 0
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      //! Fetched data
      provinces: [],
      categories: [],
      prices: [],
      merchants: [],

      //! filter indicator
      cat_value: 0,
      sub_cat: 0,
      //auto_complete: null,
      max_price: null,
      min_price: null,
      location: 1,
      search_result: "",
      price_range: null,
      mobile_filter: false,
      //! filter result
      show_merchant: [],
    }
  }
  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    }
    fetch("https://panjs.com/ywc18.json", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result)
        let provinces = sortThaiDictionary(data.provinces)

        this.setState({
          provinces: provinces,
          categories: data.categories,
          prices: data.priceRange,
          merchants: data.merchants,
          show_merchant: data.merchants,
        })
      })
  }

  merchantFilter = () => {
    const {
      price_range,
      cat_value,
      location,
      provinces,
      max_price,
      min_price,
      categories,
      search_result,
      sub_cat,
    } = this.state
    let new_merchant = this.state.merchants.filter((merchant) => {
      clearSlash(merchant.categoryName)
      const mer_price_rang =
        cat_value === 1
          ? price_range === 0 || price_range === null
            ? true
            : merchant.priceLevel === price_range
          : priceRangeConvertor(min_price, max_price).includes(
              merchant.priceLevel
            )
      const mer_location =
        location === 1 || location === 0
          ? true
          : merchant.addressProvinceName === provinces[location - 2]
      const mer_cat =
        cat_value === 0
          ? true
          : categories[cat_value - 1]?.name.includes(merchant.categoryName)
          ? true
          : cat_value === 2
          ? checkKeyword(clearSlash(merchant.categoryName), otopShopKeyword)
          : cat_value === 4
          ? checkKeyword(clearSlash(merchant.categoryName), generalShopKeyword)
          : false
      const mer_search =
        search_result === ""
          ? true
          : merchant.shopNameTH
              .toLowerCase()
              .includes(search_result.toLowerCase())
      const mer_sub_cat =
        sub_cat === 0
          ? true
          : checkKeyword(
              clearSlash(merchant.subcategoryName),
              categories[cat_value - 1].subcategories[sub_cat - 1]
            )
      // const mer_cat = merchant.categories
      return mer_price_rang & mer_location & mer_search & mer_cat & mer_sub_cat
    })
    this.setState({
      show_merchant: new_merchant,
    })
  }

  onChangeCat = (e) => {
    this.setState(
      {
        cat_value: e.target.value,
        sub_cat: 0,
      },
      () => {
        this.merchantFilter()
      }
    )
  }
  onChangeSubCat = (e) => {
    this.setState(
      {
        sub_cat: e.target.value,
      },
      () => {
        this.merchantFilter()
      }
    )
  }
  handleChange = (value) => {}

  onChangeLocation = (value) => {
    this.setState(
      {
        location: value,
      },
      () => {
        this.merchantFilter()
      }
    )
  }

  priceFilter = (value) => {
    this.setState(
      {
        price_range: value,
      },
      () => {
        this.merchantFilter()
      }
    )
  }

  onAutoComplete = (value, index) => {
    this.setState({
      cat_value: index.index + 1,
      search_result: "",
    })
  }
  handleSearch = (e) => {
    this.merchantFilter()
  }

  closeDrawer = () => {
    this.setState({ mobile_filter: false })
  }
  showDrawer = () => {
    this.setState({ mobile_filter: true })
  }

  render() {
    const {
      cat_value,
      categories,
      provinces,
      prices,
      sub_cat,
      show_merchant,
      price_range,
      max_price,
      min_price,
      search_result,
      mobile_filter,
    } = this.state
    const { Option } = Select
    const { Header, Content, Sider } = Layout
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    }

    //! ============== Pre component ==============
    const selectBefore = (
      <>
        <Option value={0}>
          <div className="icon-container">
            <svg
              width="16"
              height="20"
              viewBox="0 0 14 20"
              fill="none"
              class="mr-2"
              style={{ marginRight: "6px" }}
            >
              <path
                d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                fill="#000"
              ></path>
            </svg>
            <span>พื้นที่ใกล้ฉัน</span>
          </div>
        </Option>
        <Option value={1}>
          <div className="icon-container">
            <svg
              width="20"
              height="30"
              viewBox="0 0 25 30"
              fill="none"
              style={{ marginRight: "6px" }}
            >
              <path
                d="M9 22l-.371.335.371.411.371-.41L9 22zm0 0l.371.335h0l.002-.002.004-.005.016-.017a4.45 4.45 0 00.02-.023l.04-.045c.053-.06.13-.147.227-.26a46.982 46.982 0 003.235-4.235c.884-1.31 1.776-2.797 2.448-4.297C16.032 11.957 16.5 10.413 16.5 9c0-4.146-3.354-7.5-7.5-7.5A7.495 7.495 0 001.5 9c0 1.414.468 2.957 1.137 4.45.672 1.5 1.564 2.988 2.449 4.298a46.985 46.985 0 003.521 4.563l.016.017.004.005.001.002h0L9 22zm0-11a2 2 0 110-4 2 2 0 010 4z"
                fill="#222"
                stroke="#fff"
              ></path>
              <path
                d="M16 28l-.371.335.371.411.371-.41L16 28zm0 0l.371.335h0l.002-.002.004-.005.016-.017a3.037 3.037 0 00.06-.068c.053-.06.13-.147.227-.26a46.982 46.982 0 003.235-4.235c.884-1.31 1.776-2.797 2.448-4.297.669-1.494 1.137-3.037 1.137-4.451 0-4.146-3.354-7.5-7.5-7.5A7.495 7.495 0 008.5 15c0 1.414.468 2.957 1.137 4.45.672 1.5 1.564 2.988 2.448 4.298a46.982 46.982 0 003.522 4.563l.016.017.004.005.001.002h0L16 28zm0-11a2 2 0 110-4 2 2 0 010 4z"
                fill="#222"
                stroke="#fff"
              ></path>
            </svg>
            <span>สถานที่ทั้งหมด</span>
          </div>
        </Option>
      </>
    )

    const filterComponent = (
      <>
        {/* //! =================== Category =================== */}
        <Card>
          <div id="shop-type" className="filter-container">
            <p className="filter-header">ประเภทร้านค้า</p>
            <Radio.Group onChange={this.onChangeCat} value={cat_value}>
              <Radio style={radioStyle} value={0}>
                ทั้งหมด
              </Radio>
              {categories.map((cat, index) => (
                <Radio style={radioStyle} value={index + 1}>
                  {cat.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          {/* //! =================== Location =================== */}
          <div id="location" className="filter-container">
            <p className="filter-header">จังหวัด/ใกล้ฉัน</p>
            <Select
              defaultValue={0}
              style={{ width: "100%" }}
              onChange={this.onChangeLocation}
              name="location"
              value={this.state.location}
            >
              <Option value={0}>
                <div className="icon-container">
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 14 20"
                    fill="none"
                    class="mr-2"
                    style={{ marginRight: "6px" }}
                  >
                    <path
                      d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                      fill="#000"
                    ></path>
                  </svg>
                  <span>พื้นที่ใกล้ฉัน</span>
                </div>
              </Option>
              <Option value={1}>
                <div className="icon-container">
                  <svg
                    width="20"
                    height="30"
                    viewBox="0 0 25 30"
                    fill="none"
                    style={{ marginRight: "6px" }}
                  >
                    <path
                      d="M9 22l-.371.335.371.411.371-.41L9 22zm0 0l.371.335h0l.002-.002.004-.005.016-.017a4.45 4.45 0 00.02-.023l.04-.045c.053-.06.13-.147.227-.26a46.982 46.982 0 003.235-4.235c.884-1.31 1.776-2.797 2.448-4.297C16.032 11.957 16.5 10.413 16.5 9c0-4.146-3.354-7.5-7.5-7.5A7.495 7.495 0 001.5 9c0 1.414.468 2.957 1.137 4.45.672 1.5 1.564 2.988 2.449 4.298a46.985 46.985 0 003.521 4.563l.016.017.004.005.001.002h0L9 22zm0-11a2 2 0 110-4 2 2 0 010 4z"
                      fill="#222"
                      stroke="#fff"
                    ></path>
                    <path
                      d="M16 28l-.371.335.371.411.371-.41L16 28zm0 0l.371.335h0l.002-.002.004-.005.016-.017a3.037 3.037 0 00.06-.068c.053-.06.13-.147.227-.26a46.982 46.982 0 003.235-4.235c.884-1.31 1.776-2.797 2.448-4.297.669-1.494 1.137-3.037 1.137-4.451 0-4.146-3.354-7.5-7.5-7.5A7.495 7.495 0 008.5 15c0 1.414.468 2.957 1.137 4.45.672 1.5 1.564 2.988 2.448 4.298a46.982 46.982 0 003.522 4.563l.016.017.004.005.001.002h0L16 28zm0-11a2 2 0 110-4 2 2 0 010 4z"
                      fill="#222"
                      stroke="#fff"
                    ></path>
                  </svg>
                  <span>สถานที่ทั้งหมด</span>
                </div>
              </Option>
              {provinces.map((prov, index) => (
                <Option value={index + 2}>{prov}</Option>
              ))}
            </Select>
          </div>
          {/* //! =================== Price =================== */}
          {cat_value === 1 ? (
            <div id="prices" className="filter-container">
              <p className="filter-header">ราคา</p>
              <Select
                style={{ width: "100%" }}
                onSelect={this.priceFilter}
                placeholder="กรุณาเลือก"
                value={price_range}
              >
                <Option value={0}>ทั้งหมด</Option>
                {prices.map((prov, index) => (
                  <Option value={index + 1}>{prov}</Option>
                ))}
              </Select>
            </div>
          ) : (
            <div id="prices" className="filter-container">
              <p className="filter-header">ราคา</p>
              <Row>
                <Col span="11" offset="0">
                  <InputNumber
                    defaultValue=""
                    placeholder="ราคาต่ำสุด"
                    min={0}
                    style={{ width: "100%" }}
                    value={min_price}
                    onChange={(value) => {
                      this.setState({ min_price: value })
                    }}
                  />
                </Col>
                <Col
                  span="2"
                  offset="0"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>-</span>
                </Col>
                <Col span="11" offset="0">
                  <InputNumber
                    defaultValue=""
                    placeholder="ราคาสูงสุด"
                    min={0}
                    style={{ width: "100%" }}
                    value={max_price}
                    onChange={(value) => {
                      this.setState({ max_price: value })
                    }}
                  />
                </Col>
              </Row>
              <Button
                block
                className="btn-primary"
                onClick={this.merchantFilter}
              >
                ตกลง
              </Button>
            </div>
          )}
          {/* //! =================== sub category =================== */}
          {cat_value === 0 ? null : (
            <div id="sub-filter" className="filter-container">
              <p className="filter-header">
                ประเภท{categories[cat_value - 1]?.name}
              </p>
              <Radio.Group onChange={this.onChangeSubCat} value={sub_cat}>
                <Radio style={radioStyle} value={0}>
                  ทั้งหมด
                </Radio>
                {categories[cat_value - 1]?.subcategories.map((cat, index) => (
                  <Radio style={radioStyle} value={index + 1}>
                    {cat}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
        </Card>
      </>
    )

    //! ============== Main component ==============
    return (
      <div className="App">
        <div id="background"></div>
        <Drawer
          placement="right"
          closable={false}
          onClose={this.closeDrawer}
          visible={mobile_filter}
          width={"100%"}
        >
          <div className="drawer-header">
            <LeftOutlined className="back-icon" onClick={this.closeDrawer} />
            <p>กรอกผล</p>
          </div>
          {filterComponent}
        </Drawer>
        <div className="navbar">
          <Row style={{ alignItems: "center" }}>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 3, offset: 1 }}>
              <img
                src="https://search-merchant.คนละครึ่ง.com/images/halfhalf-logo.png"
                alt=""
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={{ span: 2, offset: 1 }} md={{ span: 0, offset: 0 }}>
              <img
                src="https://search-merchant.คนละครึ่ง.com/images/halfhalf-logo-mini.png"
                alt=""
                width="100%"
              />
            </Col>
            <Col xs={{ span: 18, offset: 1 }} md={{ span: 17, offset: 1 }}>
              <Input.Group compact style={{ width: "100%" }}>
                <Select
                  defaultValue={0}
                  // className="select-before"
                  className="search-location hide-on-mobile"
                  style={{
                    width: "20%",
                  }}
                  bordered={true}
                  size={"large"}
                  onChange={this.onChangeLocation}
                  name="location"
                  value={this.state.location}
                >
                  {selectBefore}
                  {this.state.provinces.map((prov, index) => (
                    <Option value={index + 2}>{prov}</Option>
                  ))}
                </Select>
                <AutoComplete
                  // style={{ width: "80%" }}
                  size={"large"}
                  className="auto-complete"
                  options={categories.map((cat, index) => ({
                    value: cat.name,
                    index: index,
                  }))}
                  //value={this.state.auto_complete}
                  value={search_result}
                  onSelect={this.onAutoComplete}
                >
                  <Input.Search
                    // addonBefore={selectBefore}
                    allowClear
                    defaultValue=""
                    size={"large"}
                    className="auto-complete"
                    enterButton
                    value={search_result}
                    onChange={(e) => {
                      this.setState({ search_result: e.target.value })
                    }}
                    placeholder="ค้นหา ชื่อ ร้านอาหาร และเครื่องดื่ม ร้านธงฟ้า OTOP และ สินค้าทั่วไป"
                    onPressEnter={this.handleSearch}
                  />
                </AutoComplete>
              </Input.Group>
            </Col>
            <Col
              xs={{ span: 2, offset: 0 }}
              md={{ span: 0, offset: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={this.showDrawer}
            >
              <img
                src="https://search-merchant.คนละครึ่ง.com/images/filter.png"
                alt=""
                className="hide-on-desktop"
              />
            </Col>
          </Row>
        </div>
        <Row className="breadcrumb">
          <Col xs={{ span: 23, offset: 1 }} md={{ span: 22, offset: 2 }}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href="">หน้าแรก</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span className="text-bold">ค้นหา</span>{" "}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* //! Content */}
        <Layout>
          <Content id="content">
            <div className="header">
              <h2>
                <b>ผลการค้นหา {categories[cat_value - 1]?.name} ทั้งหมด</b>
              </h2>
            </div>
            <Layout>
              <Sider
                breakpoint="md"
                collapsedWidth="0"
                style={{ background: "transparent" }}
                width={"22rem"}
              >
                {/* <Col
                    md={{ span: 6, offset: 0 }}
                    sm={{ span: 0 }}
                    xs={{ span: 0 }}
                    id="filter"
                  > */}
                {filterComponent}
                {/* </Col> */}
              </Sider>

              {/* //! Shops */}
              <Content>
                <Row>
                  <Col
                    xs={{ span: 24, offset: 0 }}
                    md={{ span: 24, offset: 1 }}
                  >
                    {show_merchant.length === 0 ? (
                      <Card style={{ marginBottom: "1em" }}>
                        <Empty
                          description={<span>ไม่พบร้านค้าที่คุณต้องการ</span>}
                        />
                      </Card>
                    ) : (
                      <>
                        {show_merchant.map((shop) => (
                          <Card style={{ marginBottom: "1em" }}>
                            <Row>
                              <Col
                                lg={{ span: 7, offset: 1 }}
                                xs={{ span: 24, offset: 0 }}
                              >
                                <div className="img-container">
                                  <img src={shop.coverImageId} alt="" />
                                </div>
                              </Col>
                              <Col
                                lg={{ span: 0, offset: 0 }}
                                xs={{ span: 24, offset: 0 }}
                              >
                                <br />
                              </Col>
                              <Col
                                lg={{ span: 15, offset: 1 }}
                                xs={{ span: 24, offset: 0 }}
                              >
                                <div className="shop-title-container">
                                  <p className="shop-title">
                                    {shop.shopNameTH}
                                  </p>
                                  {shop.isOpen === "N/A" ? null : (
                                    <Badge
                                      count={
                                        shop.isOpen === "Y"
                                          ? "เปิดอยู่"
                                          : "ปิดอยู่"
                                      }
                                      style={
                                        shop.isOpen === "Y"
                                          ? { background: "#50CC3F" }
                                          : { background: " #AFAFAF" }
                                      }
                                    />
                                  )}
                                </div>
                                <Space className="description">
                                  <p>
                                    {shop.subcategoryName
                                      .split("/")
                                      .join("")
                                      .split(" ")
                                      .map((sup_cat) => sup_cat + " ")}
                                  </p>
                                  <p>|</p>
                                  <p>
                                    {[
                                      ...Array(Number(shop.priceLevel) || 0),
                                    ].map(() => "฿")}
                                    {[
                                      ...Array(
                                        4 - Number(shop.priceLevel) || 0
                                      ),
                                    ].map(() =>
                                      parse(
                                        "<span style='color: #BFBFBF;'>฿</span>"
                                      )
                                    )}
                                  </p>
                                  <p>|</p>
                                  <p>
                                    {shop.addressDistrictName}
                                    &ensp;
                                    {shop.addressProvinceName}
                                  </p>
                                </Space>
                                <Divider />
                                <p>{parse(shop.highlightText)}</p>
                                <p>
                                  {parse(
                                    shop.recommendedItems.length > 0
                                      ? "<b>เมนูแนะนำ : </b>" +
                                          shop.recommendedItems.map(
                                            (rec) => rec + " "
                                          )
                                      : null
                                  )}
                                </p>
                                <div style={{ display: "flex" }}>
                                  {shop.facilities.map((fac) =>
                                    fac === "ที่จอดรถ" ? (
                                      <div className="icon-container-circle">
                                        <CarOutlined className="circle-icon" />
                                      </div>
                                    ) : fac === "สามารถนำสัตว์เลี้ยงเข้าได้" ? (
                                      <div className="icon-container-circle">
                                        <Icon
                                          component={PetSvg}
                                          className="circle-icon"
                                        />
                                      </div>
                                    ) : fac === "รับจองล่วงหน้า" ? (
                                      <div className="icon-container-circle">
                                        <FileDoneOutlined className="circle-icon" />
                                      </div>
                                    ) : null
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </>
                    )}
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </div>
    )
  }
}

export default App
