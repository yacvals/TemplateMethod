abstract class MoneyTransfer {
  public process(): void {
    this.validateAccounts();
    this.authorizeTransfer();
    this.transferFunds();
    this.notifyParties();
  }

  protected validateAccounts(): void {
    console.log('Validating sender and receiver accounts...');
  }

  protected notifyParties(): void {
    console.log('Notifying sender and receiver of the transaction...');
  }

  protected abstract authorizeTransfer(): void;
  protected abstract transferFunds(): void;
}

class DomesticTransfer extends MoneyTransfer {
  protected authorizeTransfer(): void {
    console.log('Authorizing domestic transfer...');
  }

  protected transferFunds(): void {
    console.log('Domestic transfer...');
  }
}

class InternationalTransfer extends MoneyTransfer {
  protected authorizeTransfer(): void {
    console.log('Authorizing international transfer...');
  }

  protected transferFunds(): void {
    console.log('International transfer with currency conversion...');
  }
}

// Usage

console.log('--- DomesticTransfer ---');

const domesticTransfer = new DomesticTransfer();
domesticTransfer.process();

console.log('--- InternationalTransfer ---');

const internationalTransfer = new InternationalTransfer();
internationalTransfer.process();
