import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory";


const instance = new web3.eth.Contract(JSON.parse(JSON.stringify(CampaignFactory.abi)),'0x47d64DEB1F26afB4e5dF36d20958157B0b6AE8b6');

export default instance;