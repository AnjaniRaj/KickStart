const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory');

const provider = new HDWalletProvider(
    'mnemonic',
    'infura url'
);
const web3 = new Web3(provider);

//made it a fxn so we can use async await
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from ', accounts[0]);
    try {
        const txnHash = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
            .deploy({data: '0x' + compiledFactory.evm.bytecode.object})
            .send({from: accounts[0] },function (error,txn) {
                console.log(error)
                console.log(txn)
            }).on('error', function(error){ console.log("In error ",error)})
            .on('transactionHash', function(transactionHash){ console.log("In txn ", transactionHash)})
            .on('receipt', function(receipt){
                console.log(receipt.contractAddress) // contains the new contract address
            })
            .on('confirmation', function(confirmationNumber, receipt){ console.log("in confirmation ", confirmationNumber, receipt) })
            .then(function(newContractInstance){
                console.log("in new contarct " ,newContractInstance.options.address) // instance with the new contract address
            })
    } catch (e) {
        console.log(e);
    }
};

deploy();
// contract address = 0x47d64DEB1F26afB4e5dF36d20958157B0b6AE8b6