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

describe('Campaigns', () => {

    it('deploys factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });

    it('marks contributers as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            value: '200'
        });

        assert(await campaign.methods.approvers(accounts[1]).call());
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        } catch (e) {
            assert(e);
        }
    });

    it('allows requests from maanger', async ()=>{
        await campaign.methods.createRequest('Buy stuff','100',accounts[1]).send({
            from:accounts[0],
            gas:'1000000'
        });

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual(request.description,'Buy stuff');
    });

    it('processes request',async ()=>{
       await campaign.methods.contribute().send({
           from:accounts[1],
           value: web3.utils.toWei('10',"ether")
       });
        await campaign.methods.createRequest('Buy stuff',web3.utils.toWei('5',"ether"),accounts[2]).send({
            from:accounts[0],
            gas:'1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from:accounts[1],
            gas:'1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });

        let balance= await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance,"ether");
        balance = parseFloat(balance);

        console.log(balance);
        assert(balance> 103);
        
    });

});
