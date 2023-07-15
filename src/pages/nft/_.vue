<script setup lang="ts">
import { ethers } from "ethers";
import defineContract from "../../ts/defineContract";

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
let contract = ref(null) as any;
let userAddress = ref("") as any;
let connected = ref(false);
let isMint = ref(false) as any;
onMounted(async () => {
  nftData.value = await store.actionGetIndividualNftData(route.params.slug);
  for (let nft of store.getSelectedNftData) {
    console.log(nft);
    nftData.edition == nft.edition ? (foundOne.value = false) : (foundOne.value = true);
    if (foundOne.value == false) break;
  }
  if (window.ethereum) {
    contract.value = defineContract()
    walletExists.value = true;
  }
});

let isMinted = async () => {
  contract.value.alreadyExistingTokens(nftData.value.edition).then((val: any) => {
    if (val != 0x0000000000000000000000000000000000000000) {
      console.log("not");
      console.log(val);
      isMint.value = true;
    } else {
      isMint.value = false;
      console.log("yes");
    }
  });
};

let mint = async (item: any) => {
  let tokens = [] as any;
  let price = 0;
  tokens.push(item.edition);
  price += getPrice(item.edition)!;
  console.log(price.toString(), tokens)
  await contract.value.mint(userAddress.value, tokens, {
    value: ethers.utils.parseEther(price.toString()),
    gasPrice:"285000"
  });
  store.actionRemoveNftSelected(item);
};

let connectWallet = async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    userAddress.value = window.ethereum.selectedAddress;
    connected.value = true;

    isMinted();
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
              <p
                class="has-text-centered is-size-3 has-text-centered"
                v-if="connected == true && isMint == true"
              >
                This NFT is Minted
              </p>

              <div class="buttons is-centered" v-if="walletExists == true">
                <button
                  class="button is-fullwidth is-large is-info"
                  v-if="connected == true && isMint == false"
                  @click="mint(nftData)"
                >
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
                <button
                  class="button is-fullwidth is-large is-info"
                  v-if="connected != true && isMint == false"
                  @click="connectWallet"
                >
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
              <div class="buttons is-centered"  v-show="walletExists == false">
                  <a
                    class="button is-rounded is-outlined is-fullwidth is-info"
                    href="https://metamask.io/"
                  >
                    <svg
                      fill="none"
                      height="30"
                      viewBox="0 0 40 40"
                      style="position: relative; top: 3px"
                      width="30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width=".25"
                      >
                        <path
                          d="m32.9582 1-13.1341 9.7183 2.4424-5.72731z"
                          fill="#e17726"
                          stroke="#e17726"
                        ></path>
                        <g fill="#e27625" stroke="#e27625">
                          <path d="m2.66296 1 13.01714 9.809-2.3254-5.81802z"></path>
                          <path
                            d="m28.2295 23.5335-3.4947 5.3386 7.4829 2.0603 2.1436-7.2823z"
                          ></path>
                          <path
                            d="m1.27281 23.6501 2.13055 7.2823 7.46994-2.0603-3.48166-5.3386z"
                          ></path>
                          <path
                            d="m10.4706 14.5149-2.0786 3.1358 7.405.3369-.2469-7.969z"
                          ></path>
                          <path
                            d="m25.1505 14.5149-5.1575-4.58704-.1688 8.05974 7.4049-.3369z"
                          ></path>
                          <path d="m10.8733 28.8721 4.4819-2.1639-3.8583-3.0062z"></path>
                          <path></path>
                        </g>
                        <path
                          d="m24.7348 28.8721-4.469-2.1639.3638 2.9025-.039 1.231z"
                          fill="#d5bfb2"
                          stroke="#d5bfb2"
                        ></path>
                        <path
                          d="m10.8732 28.8721 4.1572 1.9696-.026-1.231.3508-2.9025z"
                          fill="#d5bfb2"
                          stroke="#d5bfb2"
                        ></path>
                        <path
                          d="m15.1084 21.7842-3.7155-1.0884 2.6243-1.2051z"
                          fill="#233447"
                          stroke="#233447"
                        ></path>
                        <path
                          d="m20.5126 21.7842 1.0913-2.2935 2.6372 1.2051z"
                          fill="#233447"
                          stroke="#233447"
                        ></path>
                        <path
                          d="m10.8733 28.8721.6495-5.3386-4.13117.1167z"
                          fill="#cc6228"
                          stroke="#cc6228"
                        ></path>
                        <path
                          d="m24.0982 23.5335.6366 5.3386 3.4946-5.2219z"
                          fill="#cc6228"
                          stroke="#cc6228"
                        ></path>
                        <path
                          d="m27.2291 17.6507-7.405.3369.6885 3.7966 1.0913-2.2935 2.6372 1.2051z"
                          fill="#cc6228"
                          stroke="#cc6228"
                        ></path>
                        <path
                          d="m11.3929 20.6958 2.6242-1.2051 1.0913 2.2935.6885-3.7966-7.40495-.3369z"
                          fill="#cc6228"
                          stroke="#cc6228"
                        ></path>
                        <path fill="#e27525" stroke="#e27525"></path>
                        <path
                          d="m24.2412 20.6958-.1169 3.0062 3.1049-6.0513z"
                          fill="#e27525"
                          stroke="#e27525"
                        ></path>
                        <path
                          d="m15.797 17.9876-.6886 3.7967.8704 4.4833.1949-5.9087z"
                          fill="#e27525"
                          stroke="#e27525"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m19.8242 17.9876-.3638 2.3584.1819 5.9216.8704-4.4833z"
                          fill="#e27525"
                          stroke="#e27525"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m20.5127 21.7842-.8704 4.4834.6236.4406 3.8584-3.0062.1169-3.0062z"
                          fill="#f5841f"
                          stroke="#f5841f"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m11.3929 20.6958.104 3.0062 3.8583 3.0062.6236-.4406-.8704-4.4834z"
                          fill="#f5841f"
                          stroke="#f5841f"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m20.5906 30.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026 1.231-4.1572-1.9696 1.4551 1.1921 2.9489 2.0344h5.0536l2.962-2.0344 1.442-1.1921z"
                          fill="#c0ac9d"
                          stroke="#c0ac9d"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m20.2659 26.7082-.6236-.4406h-3.6635l-.6236.4406-.3508 2.9025.3248-.2851h4.9626l.3378.2851z"
                          fill="#161616"
                          stroke="#161616"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m33.5168 11.3532 1.1043-5.36447-1.6629-4.98873-12.6923 9.3944 4.8846 4.1205 6.8983 2.0085 1.52-1.7752-.6626-.4795 1.0523-.9588-.8054-.622 1.0523-.8034z"
                          fill="#763e1a"
                          stroke="#763e1a"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m1 5.98873 1.11724 5.36447-.71451.5313 1.06527.8034-.80545.622 1.05228.9588-.66255.4795 1.51997 1.7752 6.89835-2.0085 4.8846-4.1205-12.69233-9.3944z"
                          fill="#763e1a"
                          stroke="#763e1a"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m32.0489 16.5234-6.8983-2.0085 2.0786 3.1358-3.1049 6.0513 4.1052-.0519h6.1318z"
                          fill="#f5841f"
                          stroke="#f5841f"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m10.4705 14.5149-6.89828 2.0085-2.29944 7.1267h6.11883l4.10519.0519-3.10487-6.0513z"
                          fill="#f5841f"
                          stroke="#f5841f"
                        ></path>
                        <path
                          data-v-508e312e=""
                          d="m19.8241 17.9876.4417-7.5932 2.0007-5.4034h-8.9119l2.0006 5.4034.4417 7.5932.1689 2.3842.013 5.8958h3.6635l.013-5.8958z"
                          fill="#f5841f"
                          stroke="#f5841f"
                        ></path>
                      </g>
                    </svg>
                    <span style="position: relative">MetaMask</span>
                  </a>
                  <a
                    class="button is-rounded is-outlined is-fullwidth is-info"
                    href="https://www.coinbase.com/wallet"
                  >
                    <svg
                      fill="none"
                      height="30"
                      viewBox="0 0 200 200"
                      style="position: relative; right: 5px"
                      width="30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
                        stroke="none"
                      >
                        <path
                          data-v-508e312e=""
                          fill="#1554f0 "
                          d="M879 1990 c-407 -51 -744 -349 -844 -746 -149 -587 256 -1169 860 -1236 442 -50 873 214 1035 633 51 132 64 210 64 364 -1 117 -5 156 -27 235 -82 309 -285 550 -566 671 -163 70 -360 100 -522 79z m236 -415 c117 -25 207 -75 296 -164 97 -96 142 -185 167 -320 14 -84 14 -98 0 -182 -24 -135 -69 -222 -165 -318 -99 -98 -188 -145 -321 -168 -85 -15 -99 -15 -184 0 -132 23 -223 70 -319 166 -96 96 -143 187 -166 319 -15 85 -15 99 -1 183 25 135 70 224 167 320 147 147 332 205 526 164z"
                        ></path>
                        <path
                          data-v-508e312e=""
                          fill="#1554f0 "
                          d="M825 1167 c-3 -7 -4 -87 -3 -177 l3 -165 175 0 175 0 0 175 0 175 -173 3 c-135 2 -174 0 -177 -11z"
                        ></path>
                      </g></svg
                    ><span style="position: relative">Coinbase</span>
                  </a>
              </div>
            </div>

            <div
              class="changeColor notification"
              :class="
                foundOne ? 'has-background-success-light' : 'has-background-info-light'
              "
            >
              <h1
                class="changeColor_text is-size-4 my-3 has-text-weight-bold has-text-centered"
                :class="foundOne ? 'has-text-success' : 'has-text-info'"
              >
                Select this NFT to the list!
              </h1>
              <div class="buttons is-centered">
                <button
                  class="changeColor_button button is-fullwidth is-large"
                  :class="foundOne ? 'is-success' : 'is-info'"
                  @click="addToList(nftData)"
                >
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
  scale: 1.1;
}
</style>
