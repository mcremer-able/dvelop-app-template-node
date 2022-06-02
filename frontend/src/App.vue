<script setup>
import Images from './components/ImageContainer.vue'


import { ref } from 'vue'
const filesURL = new URLSearchParams(window.location.search).get('files') 
const data = ref('')
const baseURL = 'https://able-managment-hackaton.d-velop.cloud'

/**
 * @typedef {selectionListItem[]} selectionList
 */

/**
 * @typedef {Object} linkObject
 * @property {Object} self
 * @property {string} self.href link to dms object without base path
 */

/**
 * @typedef {Object} selectionListItem
 * @property {linkObject} _links
 * @property {string} id dms Object id
 * @property {string} caption display name
 */

/**
 * @typedef {Object} dmsResponse
 * @property {selectionList} selectionList
 */


/**
 * 
 * Response from dms
 * @typedef {Object} dmsResponse
 * @property {boolean} selectionList - List items
 */

/**
 * @param {dmsResponse} res
 */
async function mapIDs(res) {
  return res.selectionList.map(item=>item.id)
}

if (filesURL) {
  fetch(filesURL).then(mapIDs).then(console.log)
  const body ={
    ids:[1,2,3,4]
  }
  //fetch('/api/todos/1')
}


</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <Images />
    </div>
  </header>

  <main>
    {{ data }}
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
