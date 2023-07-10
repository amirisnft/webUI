<script setup lang="ts">
import {ethers} from "ethers"
import abi from "../../assets/json/Amiris.json"
declare global {
  interface Window {
    ethereum: any;
  }
}
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useNftStore } from "../../stores/getNFTData";
import getPrice from "../../ts/getPrice";

const route = useRoute();

const store = useNftStore();
let nftData = ref(null) as any;
let foundOne = ref(false) as any;
let walletExists = ref(false);
let contract = ref(null) as any
let userAddress = ref("") as any
let connected = ref(false);

onMounted(async () => {
  nftData.value = await store.actionGetIndividualNftData(route.params.slug);
  for (let nft of store.getSelectedNftData) {
    console.log(nft);
    nftData.edition == nft.edition ? foundOne.value = false : foundOne.value = true;
    if (foundOne.value == false) break;
  }
  if (window.ethereum) {
    walletExists.value = true;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contractAddress= "0x7cC952b97Bb84997ef7C20f88dF0066BCe36c2E2"
    contract.value = new ethers.Contract(contractAddress, JSON.stringify(abi.abi), signer);

  }
});


let mint = async (item: any) =>  {
  let tokens = [] as any
  let price = 0
  tokens.push(item.edition)
  price += getPrice(item.edition)!
  await contract.value.mint(userAddress.value, tokens, {
    value: ethers.utils.parseEther(price.toString()),
    // gasPrice:"285000"
  })
  store.actionRemoveNftSelected(item)
}


let connectWallet = async () => {
  try {
    window.ethereum.request({ method: "eth_requestAccounts" });
    userAddress.value = window.ethereum.selectedAddress
    connected.value = true;
  } catch {}
};


let addToList = (item: any) => {
  foundOne.value = !foundOne.value;
 
  foundOne.value == true
    ? store.actionAddNftSelected(item)
    : store.actionRemoveNftSelected(item);
};
</script>

<template>
  <div>
    
    <div class="container mt-6" v-if="nftData != null">
      <div class="mt-6 pt-6">
        <RouterLink to="/" class="mt-6 is-size-4 pt-6">Back</RouterLink>
      </div>
      <div class="columns is-centered">
        <div class="column">

          <div class="p-2 has-background-info-light">
            <figure class="image">
              <img :src="nftData.image" />
            </figure>
          </div>
          <div class="mt-4">
            <article class="message is-info">
              <div class="message-header">
                <p>Description</p>
              </div>
              <div class="message-body">
                <p class="is-size-5">
                  {{ nftData.description }}
                </p>
              </div>
            </article>

            <div class="mt-4">
              <article class="message is-info">
                <div class="message-header">
                  <p>Traits</p>
                </div>
                <div class="message-body">
                  <div class="columns is-centered">
                    <div class="column" v-for="attr of nftData.attributes">
                      <div class="box attrib_hover">
                        <h1 class="is-size-4 has-text-weight-bold has-text-centered">
                          {{ attr.trait_type }}
                        </h1>
                        <h1 class="is-size-5 has-text-centered">
                          {{ attr.value }}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
        <div class="column">
          <h1 class="is-size-3 has-text-weight-bold has-text-info">
            {{ nftData.name }}
          </h1>
          <p class="is-size-4 my-4 icon-text">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>ethereum</title>
              <path
                d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z"
              />
            </svg>
            <span class="mb-4"> Eth: {{ getPrice(nftData.edition) }} </span>
          </p>
          <div>
            <div class="notification">
              <h1
                class="is-size-4 my-3 has-text-info has-text-weight-bold has-text-centered"
              >
                Mint this NFT!
              </h1>
              <div class="buttons is-centered">
                <button class="button is-fullwidth is-large is-info" v-if="connected == true" @click="mint(nftData)">
                  <span class="icon-text">
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>circle-multiple-outline</title>
                        <path
                          fill="white"
                          d="M15,4A8,8 0 0,1 23,12A8,8 0 0,1 15,20A8,8 0 0,1 7,12A8,8 0 0,1 15,4M15,18A6,6 0 0,0 21,12A6,6 0 0,0 15,6A6,6 0 0,0 9,12A6,6 0 0,0 15,18M3,12C3,14.61 4.67,16.83 7,17.65V19.74C3.55,18.85 1,15.73 1,12C1,8.27 3.55,5.15 7,4.26V6.35C4.67,7.17 3,9.39 3,12Z"
                        />
                      </svg>
                    </span>

                    <span class="mt-1"> Mint </span>
                  </span>
                </button>
               <button class="button is-fullwidth is-large is-info" v-else @click="connectWallet">
                  <span class="icon-text">
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>circle-multiple-outline</title>
                        <path
                          fill="white"
                          d="M15,4A8,8 0 0,1 23,12A8,8 0 0,1 15,20A8,8 0 0,1 7,12A8,8 0 0,1 15,4M15,18A6,6 0 0,0 21,12A6,6 0 0,0 15,6A6,6 0 0,0 9,12A6,6 0 0,0 15,18M3,12C3,14.61 4.67,16.83 7,17.65V19.74C3.55,18.85 1,15.73 1,12C1,8.27 3.55,5.15 7,4.26V6.35C4.67,7.17 3,9.39 3,12Z"
                        />
                      </svg>
                    </span>

                    <span class="mt-1"> Connect </span>
                  </span>
                </button>
              </div>
            </div>

            <div class="changeColor notification" :class="foundOne ? 'has-background-success-light' : 'has-background-info-light'">
              <h1
                class="changeColor_text is-size-4 my-3  has-text-weight-bold has-text-centered"
                :class="foundOne ? 'has-text-success' : 'has-text-info'"
              >
                Select this NFT to the list!
              </h1>
              <div class="buttons is-centered">
                <button class="changeColor_button button is-fullwidth is-large" :class="foundOne ? 'is-success' : 'is-info' " @click="addToList(nftData)">
                  <span class="icon-text">
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>circle-multiple-outline</title>
                        <path
                          fill="white"
                          d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z"
                        />
                      </svg>
                    </span>

                    <span class="mt-1"> Select </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.attrib_hover:hover {
  transition: 500ms all;
  scale:1.1;
}
</style>