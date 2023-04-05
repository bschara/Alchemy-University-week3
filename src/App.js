import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [nftmetadata, setNftMetadata] = useState();
  const [nftFloorPrice, setNftFloorPrice] = useState();
  const [transactionReceipt, setTransactionReceipt] = useState();
  const [assetTransfers, setAssetTransfers] = useState();
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  

  useEffect(() => {
    async function getBlockNumber() {
      const block = await alchemy.core.getBlockNumber();
      setBlockNumber(block);
    }

    async function getNftMetadata(address, tokenId){
      const response = await alchemy.nft.getNftMetadata(address, tokenId);
      setNftMetadata(response);
    }

    async function getNftFloorPrice(address){
      const response = await alchemy.nft.getFloorPrice(address);
      setNftFloorPrice(response);
    }
 
    async function getTransactionReceipt(txHash){
      try {
        const response = await alchemy.core.getTransactionReceipt(txHash);
        setTransactionReceipt(response);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAssetTransfer(address) {
      const res = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: address,
        excludeZeroValue: true,
        category: ["erc721", "erc1155", "erc20"],
      });
      setAssetTransfers(res);
    }

    if (address1 && address2) {
      getNftMetadata(address1, 6353);
      getNftFloorPrice(address2);
      getTransactionReceipt("0x51bb0395c9f2ff0570c9432a4512c061d21430d242a4a0e61446450571a61f80");
      getAssetTransfer(address1);
    }
    
    getBlockNumber();
    
  }, [address1, address2]);
  
   
  return (
    <div className="App">
      <div className="AddressInputs">
        <input type="text" placeholder="Enter address 1" value={address1} onChange={e => setAddress1(e.target.value)} />
        <input type="text" placeholder="Enter address 2" value={address2} onChange={e => setAddress2(e.target.value)} />
      </div>
      <p className='BlockNumber'>Latest Block Number: {blockNumber}</p>
      <p className='NftMetadata'>NFT metadata: {nftmetadata ? JSON.stringify(nftmetadata, null, 2) : "Loading..."}</p>
      <p className="NftFloorprice">NFT collection floor price: {nftFloorPrice ? JSON.stringify(nftFloorPrice, null, 2) : "Loading..."}</p>
      <p className="TransactionReceipt">Transaction Receipt: {transactionReceipt ? JSON.stringify(transactionReceipt, null, 2) : "not confirmed yet..."}</p>
      <p className="AssetTransfer">Transaction received by this address: {assetTransfers ? JSON.stringify(assetTransfers, null, 2) : "0 transactions..."}</p>
    </div>
  
  );

  
}

export default App;
