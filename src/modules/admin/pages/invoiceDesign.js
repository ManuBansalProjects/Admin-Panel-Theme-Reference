import React from "react";
import Breadcrums from "../common/breadcrumbs";

function InvoiceDesign() {
  const breadcrumbs = [
    { title: "Dashboard", url: "/admin/dashboard" },
    { title: "Invoice", url: "" },
  ];
  return (
    <>
      <Breadcrums data={breadcrumbs} />
      {/* table section */}
      <div className="animation_fade">
        <div className="card custom-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="main-content-label">Invoice</h6>
            </div>
            <div className="table-responsive">
              <table width="100%">
                <tr>
                  <td style={{ width: "80%" }}>
                    <table width="100%">
                      <tr>
                        {" "}
                        <td>
                          <img src="https://evntmngapi.devtechnosys.tech/uploads/portal-design/default_logo_transparent.png" alt="Invoice"></img>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <br></br>
                          <br></br>
                          <br></br>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style={{ margin: "0px", color: "#000" }}>
                            Company Name
                          </p>
                          <p style={{ margin: "0px", color: "#BBB6B3" }}>
                            (for Fabian Geiselhart)
                          </p>
                          <p style={{ margin: "0px", color: "#000" }}>
                            Example Street 1
                          </p>
                          <p style={{ margin: "0px", color: "#000" }}>
                            12345 City
                          </p>
                          <p style={{ margin: "0px", color: "#000" }}>
                            Country
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top">
                    <table width="100%">
                      <tr>
                        <td colSpan={4}>
                          <p style={{ margin: "0px", color: "#000" }}>
                            GALL GmbH
                          </p>
                          <p style={{ margin: "0px", color: "#000" }}>
                            Tuebinger Str. 81
                          </p>
                          <p style={{ margin: "0px", color: "#000" }}>
                            71032 Boeblingen
                          </p>
                          <p style={{ margin: "0px", color: "#000" }}>
                            Germany
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <br></br>
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="120px"
                          style={{
                            margin: "0px",
                            color: "#BBB6B3",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          Tel:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#BBB6B3",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          +49 7031 4610-0
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="120px"
                          style={{
                            margin: "0px",
                            color: "#BBB6B3",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          Email:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#BBB6B3",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          info@gall-group.com
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="120px"
                          style={{
                            margin: "0px",
                            color: "#BBB6B3",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          Web:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#BBB6B3",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          www.gall-group.com
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="120px"
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          Date:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          25. October 2023
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <br></br>
                          <br></br>
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="120px"
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          Invoice Nr:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          20012
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <br></br>
                    <br></br>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <table width="100%">
                      <tr>
                        <td colSpan={2}>
                          <h3
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "600",
                              paddingBottom: "10px",
                            }}
                          >
                            INVOICE
                          </h3>
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="200px"
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "400",
                          }}
                        >
                          Date of Service:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "400",
                          }}
                        >
                          {" "}
                          DD.MM.YYYY – DD.MM.YYYY
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="200px"
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "400",
                          }}
                        >
                          Event:
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "400",
                          }}
                        >
                          {" "}
                          Event Name
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6}>
                    <table width="100%">
                      <tr>
                        <th
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                            borderTop: "1px solid #000",
                          }}
                        >
                          Qty
                        </th>
                        <th
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderTop: "1px solid #000",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderTop: "1px solid #000",
                          }}
                        >
                          Net price
                        </th>
                        <th
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderTop: "1px solid #000",
                          }}
                        >
                          Tax %
                        </th>
                        <th
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderTop: "1px solid #000",
                          }}
                        >
                          Tax amount
                        </th>
                        <th
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderTop: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Gross price
                        </th>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee guest
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          3
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Hotel Sleep – Double room
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          150.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          7 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          10.50 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          481.50 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Breakfast
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          10.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          1.90 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          71.40 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          1
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        >
                          Event fee
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          100.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19 %
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          19.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          119.00 €
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <br></br>
                          <br></br>
                        </td>
                      </tr>
                      <tr>
                        <th
                          colSpan={2}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                            borderTop: "1px solid #000",
                          }}
                        >
                          Total gross price
                        </th>
                        <th
                          colSpan={4}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                            borderTop: "1px solid #000",
                          }}
                        >
                          1,279.52 €
                        </th>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          19 % Tax
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          658.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          =
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          125.02 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          783.02 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          19 % Tax
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          658.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          =
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          125.02 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          783.02 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            textAlign: "center",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          19 % Tax
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          658.00 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          =
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          125.02 €
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          783.02 €
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            textAlign: "left",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            borderLeft: "1px solid #000",
                          }}
                        >
                          Total net price
                        </td>
                        <td
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: "700",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                            textAlign: "right",
                          }}
                        >
                          1,123.00 €
                        </td>
                        <td
                          colSpan={3}
                          style={{
                            margin: "0px",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            padding: "5px 15px",
                            borderBottom: "1px solid #000",
                            borderRight: "1px solid #000",
                          }}
                        ></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <table width="100%">
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            Sparkasse Pforzheim Calw
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            IBAN DE76 6665 0085 0004 6501 74
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            BIC PZHSDE66XXX
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            District Court Stuttgart HRB 242974
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            VAT ID: DE145164742
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            Tax Nr: 56456/00710
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            Commerzbank Boeblingen
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            IBAN DE92 6004 0071 0625 7315 00
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              textAlign: "center",
                            }}
                          >
                            BIC COBADEFFXXX
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default InvoiceDesign;
