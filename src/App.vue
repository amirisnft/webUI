<script setup lang="ts">
import Header from "./components/Header.vue"
import Drawer from "./components/Drawer.vue"
import { useNftStore } from "./stores/getNFTData.ts";
import { onMounted } from "vue";

const store = useNftStore();

onMounted(async () => {
  store.actionGetNftData();

});

</script>

<template>
  <div>
    <component :is="Header"/>
    <component :is="Drawer"/>
    <router-view></router-view>
  </div>
</template>