import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    //check if code in running in a browser and has metamask in it
    web3 = new Web3(window.ethereum);

} else {
    //we are not on browser (on server) or the user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/de72ca31dd2544fd8c1b4fb64dfefc8f');
    web3 = new Web3(provider);
}

export default web3;