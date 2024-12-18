'use strict';

class MoneyTransfer {
  process() {
    this.validateAccounts();
    this.authorizeTransfer();
    this.transferFunds();
    this.notifyParties();
  }

  validateAccounts() {
    console.log('Validating sender and receiver accounts...');
  }

  notifyParties() {
    console.log('Notifying sender and receiver of the transaction...');
  }

  authorizeTransfer() {
    throw new Error('Authorize method must be implemented');
  }

  transferFunds() {
    throw new Error('TransferFunds method must be implemented');
  }
}

class DomesticTransfer extends MoneyTransfer {
  authorizeTransfer() {
    console.log('Authorizing domestic transfer...');
  }

  transferFunds() {
    console.log('Domestic transfer...');
  }
}

class InternationalTransfer extends MoneyTransfer {
  authorizeTransfer() {
    console.log('Authorizing international transfer...');
  }

  transferFunds() {
    console.log('International transfer with currency conversion...');
  }
}

// Usage

console.log('--- Abstract: MoneyTransfer ---');

try {
  const moneyTransfer = new MoneyTransfer();
  moneyTransfer.process();
} catch (error) {
  console.log(error);
}

console.log('--- DomesticTransfer ---');

const domesticTransfer = new DomesticTransfer();
domesticTransfer.process();

console.log('--- InternationalTransfer ---');

const internationalTransfer = new InternationalTransfer();
internationalTransfer.process();
