<script setup>
import { reactive, ref } from "vue";
import Images from "./components/ImageContainer.vue";
import * as sampleData from "./sampleData.json"

const filesURL = new URLSearchParams(window.location.search).get("files");
const data = ref("");
const baseURL = "https://able-managment-hackaton.d-velop.cloud";

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
async function mapIDs(vals) {
  const items = vals.selectionList ? vals.selectionList : [];
  return items.map((item) => item.id);
}

const files = ref([]);


const isDev = true

async function getSelection(filesURL){
  if (isDev) {
    return sampleData
  } else {
    return fetch(filesURL).then(res=>res.json())
  }
}



if (filesURL) {
  getSelection(filesURL)
    .then(mapIDs)
    .then((e) =>
      e.map((id) => {
        files.value.push({
          id,
          url: "https://source.unsplash.com/random/300x300/?city,night",
          mime: "pdf",
        });
      })
    );
  const body = {
    ids: [1, 2, 3, 4],
  };
  //fetch('/api/todos/1')
}
</script>

<template>
  <main class="container" >
    <span>Your Files</span>

    <article class="flexy" >
      <Images
        v-for="image in files"
        :key="image.id"
        :url="image.url"
        :mime="image.mime"
      />
    </article>
  </main>
</template>

<style>
@import "./assets/pico.min.css";

.flexy {
  width: 100%;
  height: 100vh;
  display: grid;
  border: 1px black;
  grid-template-columns: repeat(3, 1fr);
  padding-block-start: 1rem;
  align-content: baseline;
  justify-content: center;
  gap: 0.5rem;
}
body {
  padding: 3rem;
}
</style>
