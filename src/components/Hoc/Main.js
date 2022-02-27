import React, { useState } from "react";
import Web3 from "web3";
import tetherImg from "../../assets/tether.png";

const Main = (props) => {
  const { tetherBal, rwdBal, stakingBal } = props;
  const { stakeTokens, unstakeTokens } = props;
  const [amount, setAmount] = useState("");

  const onDeposit = (e) => {
    e.preventDefault();
    const stakeAmount = Web3.utils.toWei(amount, "ether");
    stakeTokens(stakeAmount);
  };

  return (
    <div id="content" className="mt-3">
      <table className="table text-muted text-center">
        <thead>
          <tr style={{ color: "black" }}>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: "black" }}>
            <td>{Web3.utils.fromWei(stakingBal, "ether")} USDT</td>
            <td>{Web3.utils.fromWei(rwdBal, "ether")} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-2 py-2 px-3" style={{ opacity: ".9" }}>
        <form className="mb-3 " onSubmit={onDeposit}>
          <div style={{ borderSpacing: "0 1em" }}>
            <label className="float-left" style={{ marginLeft: "15px" }}>
              <b>Stake Tokens</b>
            </label>
            <span className="float-right" style={{ marginRight: "15px" }}>
              Balance : {Web3.utils.fromWei(tetherBal, "ether")} Tether
            </span>
            <div className="input-group mb-4">
              <input
                type="number"
                name="amount"
                placeholder="0"
                required
                onChange={({ target: T }) => setAmount(T.value)}
              />
              <div className="input-group-open">
                <div className="input-group-text">
                  <img src={tetherImg} height="32" alt="tether" />
                  &nbsp; &nbsp; &nbsp; USDT
                </div>
              </div>
            </div>
            <button type="submit" className={css.btn}>
              Deposit
            </button>
          </div>
        </form>
        <button onClick={unstakeTokens} className={css.btn}>
          Withdraw
        </button>
        <div className="card-body text-center" style={{ color: "blue" }}>
          AIRDROP
        </div>
      </div>
    </div>
  );
};

const css = {
  btn: "btn btn-primary btn-lg btn-block",
};

export default Main;
