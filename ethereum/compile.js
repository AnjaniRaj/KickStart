const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
const buildPath = path.resolve(__dirname,'build');

//delete existing build folder
fs.removeSync(buildPath);

//compile
const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf8');
const compilerInput = {
    language: "Solidity",
    sources: {
        'CampaignContracts': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            "*": {
                "*": [  "*" ]
            }
        }
    }
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
console.log(compiledContract);
if(compiledContract.errors) {
    compiledContract.errors.forEach(err => console.log(err.formattedMessage));
}

// const contract = compiledContract.contracts['CampaignContracts'].Campaign;
// console.log(contract)

//make build folder
fs.ensureDirSync(buildPath);

for (let contract in compiledContract.contracts['CampaignContracts']){
    console.log(contract);
    fs.outputJsonSync(
        path.resolve(buildPath,contract+'.json'),
        compiledContract.contracts['CampaignContracts'][contract]
    );
}
