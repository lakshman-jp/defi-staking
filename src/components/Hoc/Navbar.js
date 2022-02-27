import React from "react";
import BankImg from "../../assets/bank.png";

const Navbar = ({ account }) => {
  return (
    <nav className={css.clsNav} style={css.stlNav}>
      <a href="/" className={css.clsBrand} style={css.stlTitle}>
        <img src={BankImg} alt="Bank" {...imgProps} />
        <span>DAPP Yield Staking (Decentralized Banking)</span>
      </a>
      <ul className={css.clsUL}>
        <li className={css.clsLI}>
          <small style={css.stlTitle}>Account Number : {account}</small>
        </li>
      </ul>
    </nav>
  );
};

const css = {
  clsNav: "navbar navbar-dark fixed-top shadow p-0",
  stlNav: { backgroundColor: "black", height: "50px" },
  clsBrand: "navbar-brand col-sm-3 col-md-2 mr-0",
  clsBrandImg: "mr-2 d-inline-block align-top",
  stlTitle: { color: "white" },
  clsUL: "navbar-nav px-3",
  clsLI: "text-nowrap d-none nav-item d-sm-none d-sm-block",
};

const imgProps = {
  width: "50",
  height: "30",
  className: css.clsBrandImg,
};

export default Navbar;
