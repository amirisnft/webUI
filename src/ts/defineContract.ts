import abi from "../assets/json/Amiris.json"
import { ethers } from "ethers"

let defineContract = () => {
  if(window.ethereum) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let contractAddress= "0xF59a3786c27c9C610e4632f04802F55E414af89b"
  return new ethers.Contract(contractAddress, JSON.stringify(abi.abi), signer);

  } else {
    return false
  }
}

export default defineContract
