<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useNftStore } from "../stores/getNFTData.ts";
import defineContract from "../ts/defineContract";
import getPrice from "../ts/getPrice";

const store = useNftStore();

let contract = ref(null) as any

onMounted(() => {
  contract.value = defineContract()
})

let selectNft = (item: any) => {
  let foundOne = true;
  for (let nft of store.getSelectedNftData) {
    console.log(nft);
    item.edition == nft.edition ? (foundOne = false) : (foundOne = true);
    if (foundOne == false) break;
  }
  console.log(foundOne);
  foundOne == true
    ? store.actionAddNftSelected(item)
    : store.actionRemoveNftSelected(item);
};


let lookForSelectedNft = (item: any) => {
  let foundOne = false;
  for (let nft of store.getSelectedNftData) {
    item.edition == nft.edition && foundOne == false
      ? (foundOne = true)
      : (foundOne = false);
    if (foundOne == true) break;
  }
  return foundOne;
};
</script>

<template>
  <div class="container">
    <div class="my-6">
      <div class="columns"></div>
    </div>

    <div class="columns is-centered is-multiline">
      <div class="column is-3" v-for="item of store.getNftData">
        <div
          class="card"
          
          :class="lookForSelectedNft(item) ? 'has-background-success has-text-white' : ''"
        >
          <figure class="image">
            <img :src="item.image" />
          </figure>
          <div class="m-2" @click="selectNft(item)">
            <h1 class="is-size-5 has-text-centered my-4 has-text-weight-bold">
              {{ item.name }} 
            </h1>
            <p class="is-size-6 my-4 icon-text">
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
              <span class="mb-4"> Eth: {{ getPrice(item.edition) }} </span>
            </p>
           
              <p class="has-text-centered"> Select</p>
          </div>
            <div class="buttons is-centered m-4">
              <RouterLink
                class="button is-info is-outlined is-fullwidth is-rounded"
                :to="'/nft/' + item.edition"
              >Details</RouterLink>
            </div>
          <div class="p-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: 500ms all;
  cursor: pointer;
}

.card:hover {
  scale: 1.1;
}
</style>
