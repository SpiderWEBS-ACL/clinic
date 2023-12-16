import React from "react";
import "../components/package.css";

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
}) => {
  return (
    <div className="plan">
      <div className="inner">
        <span className="pricing">
          <span>
            {subscriptionPrice} <small>/ m</small>
          </span>
        </span>
        <p className="title">{packageName}</p>
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
          <a
            className="button"
            href="#"
            onClick={onClickBtn}
            aria-disabled={disabledBtn}
          >
            {btnSubscribeText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Package;
