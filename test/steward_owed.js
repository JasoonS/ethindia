const { BN, shouldFail, ether, expectEvent, balance, time } = require('openzeppelin-test-helpers');

const Artwork = artifacts.require('./ERC721Full.sol');
const ArtSteward = artifacts.require('./VitalikSteward.sol');

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

// todo: test over/underflows

contract('VitalikSteward owed', (accounts) => {

  let artwork;
  let steward;

  beforeEach(async () => {
    artwork = await Artwork.new("TESTARTWORK", "TA");
    steward = await ArtSteward.new(accounts[1], artwork.address, { from: accounts[0] });
  });


  it('steward: owned. transfer without steward (fail)', async () => {
    await steward.buy(1, web3.utils.toWei('1', 'ether'), { from: accounts[2], value: web3.utils.toWei('1', 'ether') });
    await shouldFail.reverting(artwork.transferFrom(accounts[2], accounts[1], 42, { from: accounts[2] }));
  });

  it('steward: owned. check patronage owed after 1 second.', async () => {
    await steward.buy(1, web3.utils.toWei('1', 'ether'), { from: accounts[2], value: web3.utils.toWei('1', 'ether') });

    const timeLastCollected = await steward.timeLastCollected.call(1);
    await time.increase(1);
    const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });

    // price * (now - timeLastCollected) * patronageNumerator/ patronageDenominator / 365 days;
    const due = ether('1').mul(owed.timestamp.sub(timeLastCollected)).mul(new BN('50000000000')).div(new BN('1000000000000')).div(new BN('31536000'));

    assert.equal(owed.patronageDue.toString(), due.toString());
  });

  // it('steward: owned. check patronage owed after 1 year.', async () => {
  //   await steward.buy(1, web3.utils.toWei('1', 'ether'), { from: accounts[2], value: web3.utils.toWei('1', 'ether') });

  //   const timeLastCollected = await steward.timeLastCollected.call(1);
  //   await time.increase(time.duration.days(365));
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });

  //   // price * (now - timeLastCollected) * patronageNumerator/ patronageDenominator / 365 days;
  //   const due = ether('1').mul(owed.timestamp.sub(timeLastCollected)).mul(new BN('50000000000')).div(new BN('1000000000000')).div(new BN('31536000'));

  //   assert.equal(owed.patronageDue.toString(), due.toString());
  //   assert.equal(owed.patronageDue.toString(), '50000000000000000'); // 5% over 365 days.
  // });

  // it('steward: owned. collect patronage successfully after 10 minutes.', async () => {
  //   await steward.buy(1, web3.utils.toWei('1', 'ether'), { from: accounts[2], value: web3.utils.toWei('1', 'ether') });

  //   await time.increase(time.duration.minutes(10));
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   const { logs } = await steward._collectPatronage();

  //   const deposit = await steward.deposit.call(1);
  //   const organizationFund = await steward.organizationFund.call(1);
  //   const timeLastCollected = await steward.timeLastCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);

  //   const calcDeposit = ether('1').sub(owed.patronageDue);
  //   expectEvent.inLogs(logs, 'LogCollection', { collected: totalCollected });
  //   assert.equal(deposit.toString(), calcDeposit.toString());
  //   assert.equal(organizationFund.toString(), owed.patronageDue.toString());
  //   assert.equal(timeLastCollected.toString(), previousBlockTime.toString());
  //   assert.equal(currentCollected.toString(), owed.patronageDue.toString());
  //   assert.equal(totalCollected.toString(), owed.patronageDue.toString());
  // });

  // it('steward: owned. collect patronage successfully after 10min and again after 10min.', async () => {
  //   await steward.buy(1, web3.utils.toWei('1', 'ether'), { from: accounts[2], value: web3.utils.toWei('1', 'ether') });

  //   await time.increase(time.duration.minutes(10));
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   await steward._collectPatronage();
  //   await time.increase(time.duration.minutes(10));
  //   const owed2 = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   await steward._collectPatronage();

  //   const deposit = await steward.deposit.call(1);
  //   const organizationFund = await steward.organizationFund.call(1);
  //   const timeLastCollected = await steward.timeLastCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);

  //   const calcDeposit = ether('1').sub(owed.patronageDue).sub(owed2.patronageDue);
  //   const calcorganizationFund = owed.patronageDue.add(owed2.patronageDue);
  //   const calcCurrentCollected = owed.patronageDue.add(owed2.patronageDue);
  //   const calcTotalCurrentCollected = owed.patronageDue.add(owed2.patronageDue);

  //   assert.equal(deposit.toString(), calcDeposit.toString());
  //   assert.equal(organizationFund.toString(), calcorganizationFund.toString());
  //   assert.equal(timeLastCollected.toString(), previousBlockTime.toString());
  //   assert.equal(currentCollected.toString(), calcCurrentCollected.toString());
  //   assert.equal(totalCollected.toString(), calcTotalCurrentCollected.toString());
  // });

  // it('steward: owned. collect patronage that forecloses precisely after 10min.', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });
  //   const pred = await steward.deposit.call(1);

  //   await time.increase(time.duration.minutes(10));
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   const { logs } = await steward._collectPatronage(); // will foreclose

  //   const deposit = await steward.deposit.call(1);
  //   const organizationFund = await steward.organizationFund.call(1);
  //   const timeLastCollected = await steward.timeLastCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);
  //   const state = await steward.state.call(1);

  //   const calcorganizationFund = owed.patronageDue;
  //   const calcTotalCurrentCollected = owed.patronageDue;

  //   const currentOwner = await artwork.ownerOf.call(1, 42);

  //   const timeHeld = await steward.timeHeld.call(1, accounts[2]);

  //   expectEvent.inLogs(logs, 'LogForeclosure', { prevOwner: accounts[2] });
  //   assert.equal(timeHeld.toString(), time.duration.minutes(10).toString());
  //   assert.equal(currentOwner, steward.address);
  //   assert.equal(deposit.toString(), '0');
  //   assert.equal(organizationFund.toString(), calcorganizationFund.toString());
  //   assert.equal(timeLastCollected.toString(), previousBlockTime.toString());
  //   assert.equal(currentCollected.toString(), '0');
  //   assert.equal(totalCollected.toString(), calcTotalCurrentCollected.toString());
  //   assert.equal(state.toString(), '0'); // foreclosed state
  // });

  // it('steward: owned. Deposit zero after 10min of patronage (after 10min) [success].', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });

  //   await time.increase(time.duration.minutes(10));
  //   const deposit = await steward.deposit.call(1);
  //   const availableToWithdraw = await steward.depositAbleToWithdraw.call(1);

  //   assert.equal(deposit.toString(), totalToBuy.toString());
  //   assert.equal(availableToWithdraw.toString(), '0');
  // });

  // it('steward: owned. Foreclose Time is 10min into future on 10min patronage deposit [success].', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });

  //   const forecloseTime = await steward.foreclosureTime.call(1);
  //   const previousBlockTime = await time.latest();
  //   const finalTime = previousBlockTime.add(time.duration.minutes(10));
  //   assert.equal(forecloseTime.toString(), finalTime.toString());
  // });

  // it('steward: owned. buy from person that forecloses precisely after 10min.', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });
  //   const pred = await steward.deposit.call(1);

  //   await time.increase(time.duration.minutes(10));
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   const preTimeBought = await steward.timeAcquired.call(1);
  //   const { logs } = await steward.buy(1, ether('2'), { from: accounts[3], value: totalToBuy }); // will foreclose and then buy

  //   const deposit = await steward.deposit.call(1);
  //   const organizationFund = await steward.organizationFund.call(1);
  //   const timeLastCollected = await steward.timeLastCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);
  //   const state = await steward.state.call(1);

  //   const calcorganizationFund = owed.patronageDue;
  //   const calcTotalCurrentCollected = owed.patronageDue;

  //   const currentOwner = await artwork.ownerOf.call(1, 42);

  //   const timeHeld = await steward.timeHeld.call(1, accounts[2]);
  //   const calcTH = timeLastCollected.sub(preTimeBought);

  //   expectEvent.inLogs(logs, 'LogForeclosure', { prevOwner: accounts[2] });
  //   expectEvent.inLogs(logs, 'LogBuy', { owner: accounts[3], price: ether('2') });
  //   assert.equal(timeHeld.toString(), calcTH.toString());
  //   assert.equal(currentOwner, accounts[3]);
  //   assert.equal(deposit.toString(), totalToBuy.toString());
  //   assert.equal(organizationFund.toString(), calcorganizationFund.toString());
  //   assert.equal(timeLastCollected.toString(), previousBlockTime.toString());
  //   assert.equal(currentCollected.toString(), '0');
  //   assert.equal(totalCollected.toString(), calcTotalCurrentCollected.toString());
  //   assert.equal(state.toString(), '1'); // owned state
  // });

  // it('steward: owned. collect patronage by organization after 10min.', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });
  //   await time.increase(time.duration.minutes(10));
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   await steward._collectPatronage(); // will foreclose

  //   const balTrack = await balance.tracker(accounts[1]);

  //   const txReceipt = await steward.withdrawOrganizationFunds({ from: accounts[1], gasPrice: '1000000000' }); // 1 gwei gas
  //   const txCost = new BN(txReceipt.receipt.gasUsed).mul(new BN('1000000000'));
  //   const calcDiff = totalToBuy.sub(txCost);

  //   const organizationFund = await steward.organizationFund.call(1);

  //   assert.equal(organizationFund.toString(), '0');
  //   const delta = await balTrack.delta();
  //   assert.equal(delta.toString(), calcDiff.toString());
  // });

  // it('steward: owned. collect patronage. 10min deposit. 20min Foreclose.', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });

  //   await time.increase(time.duration.minutes(20));
  //   // 20min owed patronage
  //   // 10min due
  //   const foreclosed = await steward.foreclosed.call(1);
  //   const preTLC = await steward.timeLastCollected.call(1);
  //   const preDeposit = await steward.deposit.call(1);
  //   const preTimeBought = await steward.timeAcquired.call(1);
  //   const owed = await steward.patronageOwedWithTimestamp.call(1, { from: accounts[2] });
  //   await steward._collectPatronage(); // will foreclose
  //   const due = ether('1').mul(new BN('600')).mul(new BN('50000000000')).div(new BN('1000000000000')).div(new BN('31536000'));

  //   const deposit = await steward.deposit.call(1);
  //   const organizationFund = await steward.organizationFund.call(1);
  //   const timeLastCollected = await steward.timeLastCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const tlcCheck = preTLC.add((previousBlockTime.sub(preTLC)).mul(preDeposit).div(owed.patronageDue));
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);
  //   const state = await steward.state.call(1);

  //   const calcorganizationFund = due;
  //   const calcTotalCurrentCollected = due;

  //   const currentOwner = await artwork.ownerOf.call(1, 42);

  //   const timeHeld = await steward.timeHeld.call(1, accounts[2]);
  //   const calcTH = timeLastCollected.sub(preTimeBought);

  //   assert.isTrue(foreclosed);
  //   assert.equal(steward.address, currentOwner);
  //   assert.equal(timeHeld.toString(), calcTH.toString());
  //   assert.equal(deposit.toString(), '0');
  //   assert.equal(organizationFund.toString(), calcorganizationFund.toString());
  //   assert.equal(timeLastCollected.toString(), tlcCheck.toString());
  //   assert.equal(currentCollected.toString(), '0');
  //   assert.equal(totalCollected.toString(), calcTotalCurrentCollected.toString());
  //   assert.equal(state.toString(), '0'); // foreclosed state
  // });

  // it('steward: owned. deposit wei success from many accounts', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await steward.depositWei({ from: accounts[2], value: ether('1') });
  //   await steward.depositWei({ from: accounts[3], value: ether('1') });
  //   const deposit = await steward.deposit.call(1);
  //   assert.equal(deposit.toString(), ether('4').toString());
  // });


  // it('steward: owned. change price to zero [fail]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await shouldFail.reverting.withMessage(steward.changePrice('0', { from: accounts[2] }), "Incorrect Price");
  // });

  // it('steward: owned. change price to more [success]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   const { logs } = await steward.changePrice(ether('3'), { from: accounts[2] });
  //   expectEvent.inLogs(logs, 'LogPriceChange', { newPrice: ether('3') });
  //   const postPrice = await steward.price.call(1);
  //   assert.equal(ether('3').toString(), postPrice.toString());
  // });

  // it('steward: owned. change price to less [success]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await steward.changePrice(ether('0.5'), { from: accounts[2] });
  //   const postPrice = await steward.price.call(1);
  //   assert.equal(ether('0.5').toString(), postPrice.toString());
  // });

  // it('steward: owned. change price to less with another account [fail]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await shouldFail.reverting.withMessage(steward.changePrice(ether('0.5'), { from: accounts[3] }), "Not patron");
  // });

  // it('steward: owned. withdraw whole deposit into foreclosure [succeed]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   const deposit = await steward.deposit.call(1);
  //   await steward.withdrawDeposit(deposit, { from: accounts[2] });
  //   const state = await steward.state.call(1);
  //   assert.equal(state, 0);
  // });

  // it('steward: owned. withdraw whole deposit through exit into foreclosure after 10min [succeed]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await time.increase(time.duration.minutes(10));
  //   await steward.exit({ from: accounts[2] });
  //   const state = await steward.state.call(1);
  //   assert.equal(state, 0);
  // });

  // it('steward: owned. withdraw some deposit [succeeds]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await steward.withdrawDeposit(ether('1'), { from: accounts[2] });
  //   const deposit = await steward.deposit.call(1);
  //   assert.equal(deposit.toString(), ether('1').toString());
  // });

  // it('steward: owned. withdraw more than exists [fail]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await shouldFail.reverting.withMessage(steward.withdrawDeposit(ether('4'), { from: accounts[2] }), "Withdrawing too much");
  // });

  // it('steward: owned. withdraw some deposit from another account [fails]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   await shouldFail.reverting.withMessage(steward.withdrawDeposit(ether('1'), { from: accounts[3] }), "Not patron");
  // });


  // it('steward: bought once, bought again from same account [success]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   const deposit = await steward.deposit.call(1);
  //   const price = await steward.price.call(1);
  //   const state = await steward.state.call(1);
  //   const currentOwner = await artwork.ownerOf.call(1, 42);
  //   assert.equal(deposit, web3.utils.toWei('2', 'ether'));
  //   assert.equal(price, web3.utils.toWei('1', 'ether'));
  //   assert.equal(state, 1);
  //   assert.equal(currentOwner, accounts[2])
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   const deposit2 = await steward.deposit.call(1);
  //   const price2 = await steward.price.call(1);
  //   const state2 = await steward.state.call(1);
  //   const currentOwner2 = await artwork.ownerOf.call(1, 42);
  //   assert.equal(deposit2, web3.utils.toWei('1', 'ether'));
  //   assert.equal(price2, web3.utils.toWei('1', 'ether'));
  //   assert.equal(state2, 1);
  //   assert.equal(currentOwner2, accounts[2]);
  // });

  // it('steward: bought once, bought again from another account [success]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   const deposit = await steward.deposit.call(1);
  //   const price = await steward.price.call(1);
  //   const state = await steward.state.call(1);
  //   const currentOwner = await artwork.ownerOf.call(1, 42)
  //   assert.equal(deposit, web3.utils.toWei('2', 'ether'));
  //   assert.equal(price, web3.utils.toWei('1', 'ether'));
  //   assert.equal(state, 1);
  //   assert.equal(currentOwner, accounts[2])
  //   await steward.buy(1, ether('1'), { from: accounts[3], value: ether('2') });
  //   const deposit2 = await steward.deposit.call(1);
  //   const price2 = await steward.price.call(1);
  //   const state2 = await steward.state.call(1);
  //   const currentOwner2 = await artwork.ownerOf.call(1, 42);
  //   assert.equal(deposit2, web3.utils.toWei('1', 'ether'));
  //   assert.equal(price2, web3.utils.toWei('1', 'ether'));
  //   assert.equal(state2, 1);
  //   assert.equal(currentOwner2, accounts[3]);
  // });

  // it('steward: bought once, bought again from another account after 10min [success]', async () => {
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: ether('2') });
  //   const deposit = await steward.deposit.call(1);
  //   const price = await steward.price.call(1);
  //   const state = await steward.state.call(1);
  //   const currentOwner = await artwork.ownerOf.call(1, 42)
  //   assert.equal(deposit, web3.utils.toWei('2', 'ether'));
  //   assert.equal(price, web3.utils.toWei('1', 'ether'));
  //   assert.equal(state, 1);
  //   assert.equal(currentOwner, accounts[2])
  //   const patronageFor10min = new BN('951293759512');

  //   await time.increase(time.duration.minutes(10));

  //   const balTrack = await balance.tracker(accounts[2]);
  //   const preBuy = await balTrack.get();
  //   const preDeposit = await steward.deposit.call(1);
  //   await steward.buy(1, ether('1'), { from: accounts[3], value: ether('2'), gasPrice: '1000000000' }); // 1 gwei

  //   const calcDiff = preDeposit.sub(patronageFor10min).add(ether('1'));

  //   const delta = await balTrack.delta();
  //   assert.equal(delta.toString(), calcDiff.toString());
  //   const deposit2 = await steward.deposit.call(1);
  //   const price2 = await steward.price.call(1);
  //   const state2 = await steward.state.call(1);
  //   const currentOwner2 = await artwork.ownerOf.call(1, 42);
  //   assert.equal(deposit2, web3.utils.toWei('1', 'ether'));
  //   assert.equal(price2, web3.utils.toWei('1', 'ether'));
  //   assert.equal(state2, 1);
  //   assert.equal(currentOwner2, accounts[3]);
  // });

  // it('steward: owned: deposit wei, change price, withdrawing deposit in foreclosure state [fail]', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });
  //   await time.increase(time.duration.minutes(20)); // into foreclosure state

  //   await shouldFail.reverting.withMessage(steward.depositWei({ from: accounts[2], value: ether('1') }), "Foreclosed");
  //   await shouldFail.reverting.withMessage(steward.changePrice(ether('2'), { from: accounts[2] }), "Foreclosed");
  //   await shouldFail.reverting.withMessage(steward.withdrawDeposit(ether('0.5'), { from: accounts[2] }), "Withdrawing too much");
  // });

  // it('steward: owned: goes into foreclosure state & bought from another account [success]', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });
  //   await time.increase(time.duration.minutes(20)); // into foreclosure state

  //   // price should be zero, thus totalToBuy should primarily going into the deposit [as if from init]
  //   await steward.buy(1, ether('2'), { from: accounts[3], value: totalToBuy });

  //   const deposit = await steward.deposit.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const timeLastCollected = await steward.timeLastCollected.call(1); // on buy.
  //   const price = await steward.price.call(1);
  //   const state = await steward.state.call(1);
  //   const owner = await artwork.ownerOf.call(1, 42);
  //   const wasPatron1 = await steward.patrons.call(1, accounts[2]);
  //   const wasPatron2 = await steward.patrons.call(1, accounts[3]);

  //   assert.equal(state, 1)
  //   assert.equal(deposit.toString(), totalToBuy.toString());
  //   assert.equal(price, web3.utils.toWei('2', 'ether'));
  //   assert.equal(totalCollected.toString(), totalToBuy.toString());
  //   assert.equal(currentCollected.toString(), '0');
  //   assert.equal(timeLastCollected.toString(), previousBlockTime.toString());
  //   assert.equal(owner, accounts[3]);
  //   assert.isTrue(wasPatron1);
  //   assert.isTrue(wasPatron2);
  // });

  // it('steward: owned: goes into foreclosure state & bought from same account [success]', async () => {
  //   // 10min of patronage
  //   const totalToBuy = new BN('951293759512');
  //   await steward.buy(1, ether('1'), { from: accounts[2], value: totalToBuy });
  //   await time.increase(time.duration.minutes(20)); // into foreclosure state

  //   // price should be zero, thus totalToBuy should primarily going into the deposit [as if from init]
  //   await steward.buy(1, ether('2'), { from: accounts[2], value: totalToBuy });

  //   const deposit = await steward.deposit.call(1);
  //   const totalCollected = await steward.totalCollected.call(1);
  //   const currentCollected = await steward.currentCollected.call(1);
  //   const previousBlockTime = await time.latest();
  //   const timeLastCollected = await steward.timeLastCollected.call(1); // on buy.
  //   const price = await steward.price.call(1);
  //   const state = await steward.state.call(1);
  //   const owner = await artwork.ownerOf.call(1, 42);

  //   assert.equal(state, 1)
  //   assert.equal(deposit.toString(), totalToBuy.toString());
  //   assert.equal(price, web3.utils.toWei('2', 'ether'));
  //   assert.equal(totalCollected.toString(), totalToBuy.toString());
  //   assert.equal(currentCollected.toString(), '0');
  //   assert.equal(timeLastCollected.toString(), previousBlockTime.toString());
  //   assert.equal(owner, accounts[2]);
  // });

  // describe('the organization can assign another address to act as the stewart', () => {

  //   it('an entity that is not the current organization should NOT be able to change the organization', async () => {
  //     await shouldFail.reverting.withMessage(steward.changeReceivingOrganization(accounts[2], { from: accounts[3] }), "Not organization");
  //   })

  //   it('the current organisation should be able to change the organization', async () => {
  //     await steward.changeReceivingOrganization(accounts[3], { from: accounts[1] })
  //     const newOwner = await steward.organization.call(1)
  //     assert.equal(newOwner, accounts[3])
  //     // return back to the previous owner to make this test isomorphic
  //     await steward.changeReceivingOrganization(accounts[1], { from: accounts[3] })
  //     const prevOwner = await steward.organization.call(1)
  //     assert.equal(prevOwner, accounts[1])
  //   })
  // })
});
