<script setup lang="ts">
import { useNftStore } from "../stores/getNFTData.ts";
import { onMounted } from "vue";

const store = useNftStore();
onMounted(() => {
  store.actionGetNftData();
});

let getPrice = (_id: number) => {
  if (_id <= 50) {
    return 0.01;
  } else if (_id <= 85) {
    return 0.03;
  } else if (_id <= 125) {
    return 0.05;
  } else if (_id <= 200) {
    return 0.1;
  } else if (_id <= 220) {
    return 0.3;
  } else if (_id <= 255) {
    return 0.5;
  } else if (_id <= 280) {
    return 1;
  } else if (_id <= 320) {
    return 2;
  } else if (_id <= 340) {
    return 3;
  } else if (_id <= 350) {
    return 4;
  } else if (_id <= 370) {
    return 5;
  } else if (_id <= 380) {
    return 8;
  } else if (_id <= 390) {
    return 55;
  } else if (_id <= 395) {
    return 88;
  } else if (_id <= 400) {
    return 555;
  } else if (_id <= 410) {
    return 888;
  } else if (_id <= 420) {
    return 5555;
  }
};

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
      <div class="columns">
        
      </div>
    </div>

    <div class="columns is-centered is-multiline">
      <div class="column is-3" v-for="item of store.getNftData">
        <div
          class="card"
          @click="selectNft(item)"
          :class="lookForSelectedNft(item) ? 'has-background-success has-text-white' : ''"
        >
          <figure class="image">
            <img :src="item.image" />
          </figure>
          <div class="m-2">
            <h1 class="is-size-5 has-text-centered my-4 has-text-weight-bold">
              {{ item.name }}
            </h1>
            <p class="is-size-6 my-4 icon-text">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title>ethereum</title>
                <path
                  d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z"
                />
              </svg>
              <span class="mb-4">
              Eth: {{ getPrice(item.edition) }}
              </span>
            </p>
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
