"use client";
import React from "react";

const Receipt = ({ order }) => {
  if (!order) return null;

  const { billingInfo, carryoutInfo, cartItems, paymentInfo, orderTotal, id } = order;

  // Calculate total quantity of all items
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div id="invoice-POS" className="text-center">
      <center id="top">
        <div className="info">
          <h2>Ohio State Pizza</h2>
        </div>
        <div>
          <img
            src={
              "https://media.istockphoto.com/id/1128704035/vector/funny-pizza-sign-in-retro-style.jpg?s=612x612&w=0&k=20&c=fyzXROR3sPCr4b0iWoM1ATVtkKydcI81ChmPg9RA934="
            }
            alt="Logo"
            style={{ height: "120px", width: "120px", margin: "auto" }}
          />
        </div>
      </center>

      <div id="mid">
        <div className="info">
          <h2>Contact Info</h2>
          <p>
            Name: {billingInfo.firstName} {billingInfo.lastName}<br />
            Address: {carryoutInfo.address} <br />
            Email: {billingInfo.email} <br />
            Phone: {billingInfo.phone}
          </p>
        </div>
      </div>

      <div id="bot">
        <div id="table">
          <table>
            <thead>
              <tr className="tabletitle">
                <td className="item">
                  <h4>Item</h4>
                </td>
                <td className="Hours">
                  <h4>Qty</h4>
                </td>
                <td className="Rate">
                  <h4>Sub Total</h4>
                </td>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="service">
                    <td className="tableitem" style={{
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                      alignItems: "flex-start"
                    }}>
                      <p className="itemtext">{item.name}</p>
                      {item.selectedOptions.toppings && item.selectedOptions.toppings.length > 0 && (
                        <small style={{ fontSize: "0.8em", color: "#666" }}>
                          Toppings: {item.selectedOptions.toppings.join(", ")}
                        </small>
                      )}
                      <small style={{ fontSize: "0.8em", color: "#666" }}>
                        Crust: {item.selectedOptions.crust}
                      </small>
                    </td>
                    <td className="tableitem">
                      <p className="itemtext">{item.quantity}</p>
                    </td>
                    <td className="tableitem">
                      <p className="itemtext">${item.totalPrice.toFixed(2)}</p>
                    </td>
                  </tr>
                  
                  {item.items && item.items.map((subItem, subIndex) => (
                    <tr key={`${index}-${subIndex}`} className="service">
                      <td className="tableitem" style={{
                        display: "flex",
                        justifyContent: "start",
                        paddingLeft: "20px"
                      }}>
                        <p className="itemtext" style={{ fontStyle: "italic" }}>+ {subItem.name}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">{subItem.quantity}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">${subItem.totalPrice?.toFixed(2) || "0.00"}</p>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h4>Payment Method</h4>
                </td>
                <td className="payment">
                  <h4>{paymentInfo.method} {paymentInfo.last4 ? `(•••• ${paymentInfo.last4})` : ''}</h4>
                </td>
              </tr>

              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h4>Total</h4>
                </td>
                <td className="payment">
                  <h4>${orderTotal.toFixed(2)}</h4>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="legalcopy">
          <p className="legal">
            <strong>Thank you for your business!</strong> 
            <br />
            Order ID: {id.substring(0, 8)}
            <br />
            Order Time: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;