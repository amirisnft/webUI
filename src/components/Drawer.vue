<script setup lang="ts">
import { ethers } from "ethers";
import abi from "../assets/json/Amiris.json";
declare global {
  interface Window {
    ethereum: any;
  }
}
import { onMounted, ref, computed } from "vue";
import { useNftStore } from "../stores/getNFTData.ts";
import getPrice from "../ts/getPrice";
import defineContract from "../ts/defineContract";

const store = useNftStore();

let drawer = ref(null) as any;
// let wallet = null as any
let connected = ref(false);
let loading = ref(false);
let walletExists = ref(false);
let contract = ref(null) as any;
let userAddress = ref("") as any;
// let walletStatus = "dne"

onMounted(() => {
  drawer = document.getElementById("drawer");
  if (window.ethereum) {
    console.log(abi);
    contract.value = defineContract();
    walletExists.value = true;
  }
});

let totalPrice = computed(() => {
  let price = 0;
  for (let i of store.getSelectedNftData) {
    price += getPrice(i.edition) as any;
  }
  return price;
});

let mint = async (item: any) => {
  console.log(item);
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();

  let tokens = [] as any;
  let price = 0;

  item.forEach((element: any) => {
    tokens.push(element.edition);
    price += getPrice(element.edition)!;
  });

  console.log(ethers.utils.parseEther(price.toString()));
  await contract.value.mint(userAddress.value, tokens, {
    value: ethers.utils.parseEther(price.toString()),
    // gasPrice:"285000"
  });
  store.actionRemoveNftSelected(item);
};

let connectWallet = async () => {
  loading.value = true;
  try {
    window.ethereum.request({ method: "eth_requestAccounts" });
    userAddress.value = window.ethereum.selectedAddress;
    connected.value = true;
    loading.value = false;
  } catch {}
};

const toggleMenu = () => {
  drawer.style.left = "-500px";
  // emit('update:menu', !isOpen);
};
</script>

<template>
  <div>
    <nav id="drawer">
      <div>
        <a class="is-size-4" style="margin-left: 90%" @click="toggleMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <title>close</title>
            <path
              fill="red"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </a>
      </div>
      <div v-if="store.getSelectedNftData.length > 0" class="m-1">
        <div v-for="item of store.getSelectedNftData">
          <div class="columns is-vcentered">
            <figure class="column image is-64x64">
              <img class="is-rounded mt-1" :src="item.image" />
            </figure>
            <div class="column is-6">
              <h1 class="has-text-weight-bold">
                {{ item.name }}
              </h1>
            </div>
            <div class="column">
              <a class="has-text-danger p-4" @click="store.actionRemoveNftSelected(item)">
                x
              </a>
            </div>
          </div>
        </div>

        <div class="my-3">
          <h1 class="has-text-centered">
            <span class="mb-4"> Total Eth: </span>
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
            <span class="mb-4">{{ totalPrice }} </span>
          </h1>
        </div>

        <div v-if="loading == false">
          <div class="buttons is-centered mt-4">
            <div v-show="walletExists == true">
              <button
                v-if="connected == false"
                class="button is-rounded is-info is-outlined"
                @click="connectWallet"
              >
                Connect
              </button>
              <button
                v-else
                class="button is-rounded is-info is-outlined"
                @click="mint(store.getSelectedNftData)"
              >
                Mint
              </button>
            </div>
            <div v-show="walletExists == false">
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
                  <g stroke-linecap="round" stroke-linejoin="round" stroke-width=".25">
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
        </div>
      </div>

      <div v-if="loading == true" class="mt-6">
        <progress class="progress is-small is-info" max="100">60%</progress>
      </div>

      <div v-if="store.getSelectedNftData.length <= 0">
        <h1 class="my-4 is-size-4 has-text-weight-bold">No NFTS</h1>
      </div>
    </nav>
  </div>
</template>

<style scoped>
#drawer {
  position: fixed;
  top: 0;
  z-index: 55;
  left: -300px;
  height: 100%;
  width: 300px;
  background: #f0f0f0;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
}
#drawer-toggle:checked ~ #drawer-toggle-label {
  height: 100%;
  width: calc(100% - 300px);
  background: rgba(255, 255, 255, 0.8);
}
</style>
