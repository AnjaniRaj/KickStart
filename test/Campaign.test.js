const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory');
const compiledCampaign = require('../ethereum/build/Campaign');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    //abi=interface, evm.bytecode.object = bytecode in sol >= 0.5.0
    factory = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
        .deploy({data: '0x' + compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    //assign first element to campaign address
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    //access campaign
    campaign = await new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledCampaign.abi)),
        campaignAddress
    );

});

describe('Campaigns',()=>{

    it('deploys factory and campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign',async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager,accounts[0]);
    });

    it('marks ')
});

