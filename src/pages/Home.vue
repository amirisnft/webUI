<script setup lang="ts">
import List from "../components/List.vue"
</script>

<template>
  <div>

    <div class="container my-4">
      <h1 class="my-6 pt-4 is-size-2 has-text-weight-bold has-text-centered ">Amiris PFP NFT Collection</h1>

    
      <component :is="List"/>
    </div>

  </div>
</template>
