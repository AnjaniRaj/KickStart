import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory";


const instance = new web3.eth.Contract(JSON.parse(JSON.stringify(CampaignFactory.abi)),'0xbae7dfda1d307b40e95d9641b8a20a17a1fcd9d9');

export default instance;