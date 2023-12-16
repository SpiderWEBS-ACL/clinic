import React from "react";
import "../components/package.css";
import { CloseCircleTwoTone, DeleteColumnOutlined } from "@ant-design/icons";
import { red } from "@mui/material/colors";
import { Typography } from "antd";

interface PackageProps {
  packageName: string;
  packageDescription: string;
  subscriptionPrice: any;
  doctorDiscount: string;
  pharmacyDiscount: any;
  familyDiscount: string;
  status: string;
  btnSubscribeText: any;
  statusColor: string;
  onClickBtn?: () => void;
  onClickCancel?: () => void;
  extraInfo: string;

  disabledBtn: boolean;
}
const Package: React.FC<PackageProps> = ({
  packageName,
  packageDescription,
  subscriptionPrice,
  doctorDiscount,
  pharmacyDiscount,
  familyDiscount,
  status,
  btnSubscribeText,
  statusColor,
  onClickBtn,
  disabledBtn,
  onClickCancel,
  extraInfo,
}) => {
  return (
    <div className="plan">
      <div className="inner">
        <span className="pricing">
          <span>
            {subscriptionPrice} <small>/ m</small>
          </span>
        </span>
        <p className="title" style={{ marginRight: 50 }}>
          {packageName}
        </p>
        <p className="info">{packageDescription}</p>
        <ul className="features">
          <li>
            <span className="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  fill="currentColor"
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                ></path>
              </svg>
            </span>
            <span>
              <strong>Doctor Discount: </strong> {doctorDiscount}
            </span>
          </li>
          <li>
            <span className="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  fill="currentColor"
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                ></path>
              </svg>
            </span>
            <span>
              <strong>Pharmacy Discount: </strong> {pharmacyDiscount}
            </span>
          </li>
          <li>
            <span className="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  fill="currentColor"
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                ></path>
              </svg>
            </span>
            <span>
              <strong>Family Discount: </strong> {familyDiscount}
            </span>
          </li>
          <li>
            <span className="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  fill="currentColor"
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                ></path>
              </svg>
            </span>
            <span>
              <strong>Status: </strong>{" "}
              <span style={{ color: `${statusColor}` }}>{status}</span>
            </span>
          </li>
        </ul>
        <div className="action">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a
              className={`button ${disabledBtn ? "disabled" : ""}`}
              href="#"
              onClick={onClickBtn}
              style={{
                width: btnSubscribeText === "Subscribe" ? "100%" : "100px",
                marginRight: btnSubscribeText === "Subscribe" ? "" : "20px",
                visibility: status === "Subscribe" ? "hidden" : "visible",
              }}
              aria-disabled={disabledBtn}
            >
              {btnSubscribeText}
            </a>
            <a
              className="button2"
              style={{
                cursor: "pointer",
                width: "100px",
                visibility:
                  btnSubscribeText === "Subscribe" ? "hidden" : "visible",
              }}
              onClick={onClickCancel}
            >
              <CloseCircleTwoTone twoToneColor="red" />
            </a>
          </div>
        </div>
        <Typography
          style={{ fontStyle: "italic", color: "gray", marginTop: 7.5 }}
        >
          {extraInfo}
        </Typography>
      </div>
    </div>
  );
};

export default Package;
