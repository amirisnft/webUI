<script setup lang="ts">
import { onMounted } from "vue";
let drawer:any;

onMounted(() => {
  drawer = document.getElementById("drawer");
});

const toggleMenu = () => {
  drawer.style.left = "0px";
};
</script>

<template>
  <div class="has-navbar-fixed-top">
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item m-3" @click="toggleMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <title>close</title>
              <path
                d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar-container {
  position: fixed !important;
}
</style>
