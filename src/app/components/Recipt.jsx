"use client";
import React from "react";

const Receipt = ({ order }) => {
  if (!order) return null;

  const { billingInfo, carryoutInfo, cartItems, paymentInfo, orderTotal, id } =
    order;

  const formatCurrency = (amount) =>
    `$${Number(amount).toFixed(2).toLocaleString("en-US")}`;

  return (
    <div
      id="invoice-POS"
      className="text-xs font-mono w-[280px] mx-auto p-1 text-black"
      style={{
        width: "280px", // about 2.75 inches
        fontFamily: "monospace",
        color: "black",
      }}
    >
      <div className="text-center border-b border-black pb-1 mb-1">
        <img
          src="/ReceiptLogo.png"
          alt="Logo"
          className="mx-auto mb-1"
          style={{ height: "60px", width: "60px" }}
        />
        <h2 className="text-base font-bold uppercase">Ohio State Pizza</h2>
        <p className="text-[10px]">
          123 Buckeye St, Columbus, OH 43210
          <br />
          (614) 555-1234
        </p>
      </div>

      <div className="mb-1 border-b border-black pb-1">
        <p>
          <strong>Customer:</strong> {billingInfo.firstName}{" "}
          {billingInfo.lastName}
          <br />
          <strong>Phone:</strong> {billingInfo.phone}
          <br />
          <strong>Address:</strong> {carryoutInfo.address}
        </p>
      </div>

      <table className="w-full text-[11px] mb-1">
        <thead>
          <tr className="border-b border-black">
            <th align="left">Item</th>
            <th align="center">Qty</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td colSpan={3}>
                  <span className="font-semibold">{item.name}</span>
                  <br />
                  {item.selectedOptions?.crust && (
                    <span className="text-[10px]">
                      Crust: {item.selectedOptions.crust}
                    </span>
                  )}
                  {item.selectedOptions?.toppings?.length > 0 && (
                    <span className="text-[10px]">
                      Toppings: {item.selectedOptions.toppings.join(", ")}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td></td>
                <td align="center">{item.quantity}</td>
                <td align="right">{formatCurrency(item.totalPrice)}</td>
              </tr>

              {item.items?.map((subItem, subIndex) => (
                <tr key={`${index}-${subIndex}`}>
                  <td className="pl-2 text-[10px]">+ {subItem.name}</td>
                  <td align="center">{subItem.quantity}</td>
                  <td align="right">
                    {formatCurrency(subItem.totalPrice || 0)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="border-t border-black pt-1 text-[11px]">
        <p>
          <strong>Payment:</strong> {paymentInfo.method}{" "}
          {paymentInfo.last4 ? `(•••• ${paymentInfo.last4})` : ""}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(orderTotal)}
        </p>
      </div>

      <div className="border-t border-black pt-1 mt-1 text-[10px] text-center">
        <p>Order ID: {id?.substring(0, 8)}</p>
        <p>
          Time:{" "}
          {new Date(order.createdAt).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
        <p className="mt-1 font-bold">Thank you!</p>
      </div>
    </div>
  );
};

export default Receipt;
