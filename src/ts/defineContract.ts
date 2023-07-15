import abi from "../assets/json/Amiris.json"
import { ethers } from "ethers"

let defineContract = () => {
  if(window.ethereum) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let contractAddress= "0x70eCb77B9Cd2CB1912b8Bb64ac5cd132A7b73ba1"
  return new ethers.Contract(contractAddress, JSON.stringify(abi.abi), signer);

  } else {
    return false
  }
}

export default defineContract
