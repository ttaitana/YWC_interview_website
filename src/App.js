import React from "react"
import {
  Row,
  Col,
  Input,
  Select,
  Breadcrumb,
  Card,
  Radio,
  Divider,
  Badge,
  Space,
  Button,
  AutoComplete,
} from "antd"
import Icon, { CarOutlined, FileDoneOutlined } from "@ant-design/icons"
import { ReactComponent as PetSvg } from "./pet.svg"
import parse from "html-react-parser"
import "antd/dist/antd.css"
import "./index.css"

const categoryTranslator = (type) => {
  if (type === "ร้านอาหาร") {
  }
}

const sortThaiDictionary = (list) => {
  const newList = [...list]
  newList.sort((a, b) => a.localeCompare(b, "th"))
  return newList
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      provinces: [],
      categories: [],
      prices: [],
      merchants: [],
      cat_value: 0,
      food_drink_value: 0,
      auto_complete: null,
      max_price: null,
      min_price: null,
      show_merchant: [],
      location: 0,
      search_result: "",
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
    this.state.merchants.filter((merchant) => {
      console.log(merchant.categoryName)
      console.log("-------------------")
    })
  }

  onChangeCat = (e) => {
    this.setState({
      cat_value: e.target.value,
    })
    this.merchantFilter()
  }
  onChangeFood = (e) => {
    this.setState({
      food_drink_value: e.target.value,
    })
  }
  handleChange = (value) => {}

  onChangeLocation = (value) => {
    this.setState({
      location: value,
    })
  }

  onAutoComplete = (value, index) => {
    this.setState({
      cat_value: index.index + 1,
      auto_complete: "",
    })
  }
  handleSearch = (e) => {
    console.log(`: ------------------`)
    console.log(`App -> value`, e.target.value)
    console.log(`: ------------------`)
  }

  render() {
    const { Option } = Select
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

    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    }
    const {
      cat_value,
      categories,
      provinces,
      prices,
      food_drink_value,
      show_merchant,
    } = this.state
    return (
      <div className="App">
        <div id="background"></div>
        <div className="navbar">
          <Row style={{ alignItems: "center" }}>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 2, offset: 2 }}>
              <img
                src="https://search-merchant.คนละครึ่ง.com/images/halfhalf-logo.png"
                alt=""
                height="70%"
              />
            </Col>
            <Col xs={{ span: 19, offset: 1 }} lg={{ span: 17, offset: 2 }}>
              <div style={{ display: "flex" }}>
                <Input.Group compact style={{ width: "100%" }}>
                  <Select
                    defaultValue={0}
                    // className="select-before"
                    id="search-location"
                    style={{
                      width: "20%",
                    }}
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
                    style={{ width: "80%" }}
                    size={"large"}
                    // options={[{ value: "text 1" }, { value: "text 2" }]}
                    options={categories.map((cat, index) => ({
                      value: cat.name,
                      index: index,
                    }))}
                    value={this.state.auto_complete}
                    onSelect={this.onAutoComplete}
                  >
                    <Input.Search
                      // addonBefore={selectBefore}
                      allowClear
                      defaultValue=""
                      size={"large"}
                      enterButton
                      value={this.state.search_result}
                      placeholder="ค้นหา ชื่อ ร้านอาหาร และเครื่องดื่ม ร้านธงฟ้า OTOP และ สินค้าทั่วไป"
                      onPressEnter={this.handleSearch}
                    />
                  </AutoComplete>
                </Input.Group>
              </div>
            </Col>
          </Row>
        </div>
        <Row className="breadcrumb">
          <Col xs={{ span: 23, offset: 1 }} lg={{ span: 22, offset: 2 }}>
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
        <div id="content">
          <div className="header">
            <h2>
              <b>ผลการค้นหา {categories[cat_value - 1]?.name} ทั้งหมด</b>
            </h2>
          </div>
          <Row>
            {/* //! Filter */}
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 0 }}>
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
                {cat_value === 1 ? (
                  <div id="prices" className="filter-container">
                    <p className="filter-header">ราคา</p>
                    <Select defaultValue={0} style={{ width: 200 }}>
                      {prices.map((prov, index) => (
                        <Option value={index}>{prov}</Option>
                      ))}
                    </Select>
                  </div>
                ) : (
                  <div id="prices" className="filter-container">
                    <p className="filter-header">ราคา</p>
                    <Row>
                      <Col span="11" offset="0">
                        <Input defaultValue="" placeholder="ราคาต่ำสุด" />
                      </Col>
                      <Col span="1" offset="1">
                        -
                      </Col>
                      <Col span="11" offset="0">
                        <Input defaultValue="" placeholder="ราคาสูงสุด" />
                      </Col>
                    </Row>
                    <Button block className="btn-primary">
                      Default
                    </Button>
                  </div>
                )}

                {cat_value === 0 ? null : (
                  <div id="food-drinks" className="filter-container">
                    <p className="filter-header">
                      ประเภท{categories[cat_value - 1]?.name}
                    </p>
                    <Radio.Group
                      onChange={this.onChangeFood}
                      value={food_drink_value}
                    >
                      <Radio style={radioStyle} value={0}>
                        ทั้งหมด
                      </Radio>
                      {categories[cat_value - 1]?.subcategories.map(
                        (cat, index) => (
                          <Radio style={radioStyle} value={index + 1}>
                            {cat}
                          </Radio>
                        )
                      )}
                    </Radio.Group>
                  </div>
                )}
              </Card>
            </Col>

            {/* //! Content */}
            <Col xs={{ span: 19, offset: 1 }} lg={{ span: 17, offset: 1 }}>
              {show_merchant.map((shop) => (
                <Card style={{ marginBottom: "1em" }}>
                  <Row>
                    <Col span={7} offset={1}>
                      <div className="img-container">
                        <img src={shop.coverImageId} alt="" />
                      </div>
                    </Col>
                    <Col span={15} offset={1}>
                      <div className="shop-title-container">
                        <p className="shop-title">{shop.shopNameTH}</p>
                        <Badge
                          count={shop.isOpen === "Y" ? "เปิดอยู่" : "ปิดอยู่"}
                          style={
                            shop.isOpen === "Y"
                              ? { background: "#50CC3F" }
                              : { background: " #AFAFAF" }
                          }
                        />
                      </div>
                      <Space className="description">
                        <p>{shop.subcategoryName}</p>
                        <p>|</p>
                        <p>
                          {[...Array(Number(shop.priceLevel) || 0)].map(
                            () => "฿"
                          )}
                          {[
                            ...Array(4 - Number(shop.priceLevel) || 0),
                          ].map(() =>
                            parse("<span style='color: #BFBFBF;'>฿</span>")
                          )}
                        </p>
                        <p>|</p>
                        <p>
                          {shop.addressDistrictName}
                          {shop.addressProvinceName}
                        </p>
                      </Space>
                      <Divider />
                      <p>{parse(shop.highlightText)}</p>
                      <p>
                        {parse(
                          shop.recommendedItems.length > 0
                            ? "<b>เมนูแนะนำ : </b>" +
                                shop.recommendedItems.map((rec) => rec + " ")
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
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default App