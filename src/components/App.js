import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Hoc from "./Hoc";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const [tether, setTether] = useState({});
  const [tetherBal, setTetherBal] = useState("");

  const [rwd, setRwd] = useState({});
  const [rwdBal, setRwdBal] = useState("");

  const [decentralBank, setDecentralBank] = useState({});
  const [stakingBal, setStakingBal] = useState("");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
    } else {
      const msg = "No Ethereuem browser detected!. You can check out Metamask!";
      window.alert(msg);
    }
  };
  const loadNetwork = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  const loadBlochainData = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();

    if (account) {
      // load tether data
      const tetherData = Tether.networks[networkId];
      if (tetherData) {
        const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
        const tetherBal = await tether.methods.balanceOf(account).call();
        setTether(tether);
        setTetherBal(`${tetherBal}`);
      } else {
        window.alert(`Mock Tether Token not deployed to the network.`);
      }
      // load rwd data
      const rwdData = RWD.networks[networkId];
      if (rwdData) {
        const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
        const rwdBal = await rwd.methods.balanceOf(account).call();
        setRwd(rwd);
        setRwdBal(`${rwdBal}`);
      } else {
        window.alert(`Reward Token not deployed to the network.`);
      }
      // load decentral bank data
      const bankData = DecentralBank.networks[networkId];
      if (bankData) {
        const bankToken = new web3.eth.Contract(
          DecentralBank.abi,
          bankData.address
        );
        const stakingBal = await bankToken.methods
          .stakingBalance(account)
          .call();
        setDecentralBank(bankToken);
        setStakingBal(`${stakingBal}`);
      } else {
        window.alert(`Decentral Bank not deployed to the network.`);
      }
    } else {
      window.alert(`Error! - Unable to fetch the account number.`);
    }
  };

  useEffect(() => {
    (async () => {
      await loadWeb3();
      await loadNetwork();
    })();
  }, []);

  useEffect(() => {
    !!account && (async () => await loadBlochainData())();
  }, [account]);

  // Staking Function
  const stakeTokens = (amount) => {
    setLoading(true);
    tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        decentralBank.methods
          .depositTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };

  // Unstaking Function
  const unstakeTokens = () => {
    setLoading(true);
    decentralBank.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  const MainContent = loading ? (
    <p id="loader" className="text-center h1 my-5">
      {console.log("It is Loading")}
      Loading Please Wait....
    </p>
  ) : (
    <Hoc.Main
      {...{ tetherBal, rwdBal, stakingBal, stakeTokens, unstakeTokens }}
    />
  );

  return (
    <section className="App" style={{ position: "relative" }}>
      <div style={{ position: "absolute" }}>
        <Hoc.ParticleSettings />
      </div>
      <Hoc.Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 mx-auto"
            style={{ maxWidth: "600px", minHeight: "100vm" }}
          >
            <div>{MainContent}</div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default App;
