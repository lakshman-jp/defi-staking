const RWD = artifacts.require("RWD");
const Tether = artifacts.require("Tether");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  const tokens = (num) => web3.utils.toWei(num, "ether");

  before(async () => {
    //   Load Contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // Transfer all tokens to DecentralBank (1 million)
    await rwd.transfer(decentralBank.address, tokens("1000000"));

    // Transfer 100 mock Tethers to Customer
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    // check name
    it("Name matched successfully.", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
    });
  });

  describe("Reward Token Deployment", async () => {
    // check name
    it("Name matched successfully.", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    // check name
    it("Name matched successfully.", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    // check tokens exists
    it("Contract has tokens.", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });

    describe("Yield Farming", async () => {
      it("Rewards tokens for staking", async () => {
        let result;
        // DRY items
        let msg = "";
        const fromCust = { from: customer };
        const fromOwner = { from: owner };

        // Check invester Balance
        result = await tether.balanceOf(customer);
        msg = "Customer Mock wallet balance before staking";
        assert.equal(`${result}`, tokens("100"), msg);

        // Check Staking for Customer
        await tether.approve(decentralBank.address, tokens("100"), fromCust);
        await decentralBank.depositTokens(tokens("100"), fromCust);

        // Check Updated balance of customer
        result = await tether.balanceOf(customer);
        msg = "Customer Mock wallet balance after staking 100 tokens";
        assert.equal(`${result}`, tokens("0"), msg);

        // Check Updated balance of customer
        result = await tether.balanceOf(decentralBank.address);
        msg = "Decentral Bank Mock wallet balance after staking from customer";
        assert.equal(`${result}`, tokens("100"), msg);

        // Is Staking Update
        result = await decentralBank.isStaking(customer);
        msg = "customer is staking status after staking.";
        assert.equal(`${result}`, "true", msg);

        // Issue Tokens
        await decentralBank.issueTokens(fromOwner);

        // Ensure that Only owner Can Issue Tokens
        await decentralBank.issueTokens(fromCust).should.be.rejected;

        // Unstake tokens
        await decentralBank.unstakeTokens(fromCust);

        // Check unstaking balance
        result = await tether.balanceOf(customer);
        msg = "Customer Mock wallet balance after unstaking";
        assert.equal(`${result}`, tokens("100"), msg);

        // Check Updated balance of customer
        result = await tether.balanceOf(decentralBank.address);
        msg =
          "Decentral Bank Mock wallet balance after unstaking from customer";
        assert.equal(`${result}`, tokens("0"), msg);

        // Is Staking Update
        result = await decentralBank.isStaking(customer);
        msg = "customer is no longer staking after unstaking.";
        assert.equal(`${result}`, "false", msg);
      });
    });
  });
});
