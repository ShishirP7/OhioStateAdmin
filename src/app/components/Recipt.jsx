"use client";
import React from "react";

const Receipt = ({ order }) => {
  if (!order) return null;

  const { customerName, contact, address, pizza, payment, orderId } = order;

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
            Address : {address} <br />
            Email : JohnDoe@gmail.com <br />
            Phone : {contact}
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
              <tr className="service">
                <td className="tableitem" style={{
                    display:"flex",
                    justifyContent:"start"
                }}>
                  <p className="itemtext">{pizza.productName}</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">1</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">${payment.amountPaid.toFixed(2)}</p>
                </td>
              </tr>

              {pizza.addOns.map((addon, i) => (
                <tr key={i} className="service">
                  <td className="tableitem" style={{
                    display:"flex",
                    justifyContent:"start"
                }}>
                    <p className="itemtext">{addon.name}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext">{addon.quantity}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext">-</p>
                  </td>
                </tr>
              ))}

              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h4>Tip</h4>
                </td>
                <td className="payment">
                  <h4>${payment.tip.toFixed(2)}</h4>
                </td>
              </tr>

              <tr className="tabletitle">
                <td></td>
                <td className="Rate">
                  <h4>Total</h4>
                </td>
                <td className="payment">
                  <h4>${(payment.amountPaid + payment.tip).toFixed(2)}</h4>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="legalcopy">
          <p className="legal">
            <strong>Thank you for your business!</strong> Payment is expected
            within 31 days. There will be a 5% interest charge per month on late
            invoices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
