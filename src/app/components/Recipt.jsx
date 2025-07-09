"use client";
import React from "react";

const Receipt = ({ order }) => {
  if (!order) return null;

  console.log("Order in receipt", order);

  const {
    storeId,
    billingInfo,
    carryoutInfo,
    cartItems,
    paymentInfo,
    orderTotal,
    serviceType,
    status,
    createdAt,
    _id,
  } = order;

  const formatCurrency = (amount) =>
    `$${Number(amount).toFixed(2).toLocaleString("en-US")}`;

  return (
    <div
      id="invoice-POS"
      className="text-xs font-mono w-[280px] mx-auto p-1 text-black"
      style={{
        width: "280px",
        fontFamily: "monospace",
        color: "black",
      }}
    >
      {/* Store Header */}
      <div className="text-center border-b border-black pb-1 mb-1">
        <img
          src="/ReceiptLogo.png"
          alt="Logo"
          className="mx-auto mb-1"
          style={{ height: "60px", width: "60px" }}
        />
        <h2 className="text-base font-bold uppercase">
          {storeId?.name || "Ohio State Pizza"}
        </h2>
        <p className="text-[10px]">
          {storeId?.address?.formatted || "Address Unknown"}
          <br />
          {storeId?.phone || "(614) 555-1234"}
        </p>
      </div>

      {/* Customer Info */}
      <div className="mb-1 border-b border-black pb-1">
        <p>
          <strong>Order Type:</strong> {serviceType}
          <br />
          <strong>Status:</strong> {status}
          <br />
          <strong>Name:</strong> {billingInfo.firstName} {billingInfo.lastName}
          <br />
          <strong>Phone:</strong> {billingInfo.phone}
          <br />
          {serviceType.toLowerCase() === "delivery" ? (
            <>
              <strong>Delivery Addr:</strong> {carryoutInfo.address}
            </>
          ) : (
            <>
              <strong>Pickup Time:</strong>{" "}
              {carryoutInfo.timeOption === "asap"
                ? "ASAP"
                : carryoutInfo.scheduledTime}
            </>
          )}
        </p>
      </div>

      {/* Items */}
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
                  {/* Handle numbered option groups like "0", "1", etc. */}
                  {item.selectedOptions &&
                    Object.entries(item.selectedOptions).map(
                      ([key, value], i) => (
                        <div key={i} className="text-[10px] pl-1">
                          + {key}:{" "}
                          {Array.isArray(value) ? value.join(", ") : value}
                        </div>
                      )
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

      {/* Payment */}
      <div className="border-t border-black pt-1 text-[11px]">
        <p>
          <strong>Payment:</strong> {paymentInfo.method}{" "}
          {paymentInfo.last4 ? `(•••• ${paymentInfo.last4})` : ""}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(orderTotal)}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-black pt-1 mt-1 text-[10px] text-center">
        <p>Order ID: {_id?.substring(0, 8)}</p>
        <p>
          Time:{" "}
          {new Date(createdAt).toLocaleString("en-US", {
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
