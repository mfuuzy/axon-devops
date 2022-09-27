const ERC20JSON = require("./ERC20.json");
const ethers = require("ethers");
const logger = require("./logger");

class Benchmark {
    constructor(info) {
        this.config = info.config;

        this.contract = new ethers.Contract(
            info.contracts["ERC20"],
            ERC20JSON.abi,
        );

        this.accounts = info.accounts;
        this.index = 0;
    }

    async gen_tx() {
        const index = this.index;
        this.index += 1;

        const account = this.accounts[index % this.accounts.length];

        const rawTx = await this.contract
            .connect(account.signer)
            .populateTransaction
            .transfer("0x5cf83df52a32165a7f392168ac009b168c9e8915", 0, { nonce: account.getNonce() });

        const tx = await account.signer.populateTransaction(rawTx);
        logger.debug(tx);

        return account.signer.signTransaction(tx);
    }
}

module.exports = Benchmark
