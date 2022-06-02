<script setup>
import { reactive, ref } from "vue";
import Images from "./components/ImageContainer.vue";
import * as sampleData from "./sampleData.json";

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

const isDev = !import.meta.env.PROD;

console.log(`Running in ${isDev ? "dev" : "Production"}`);

async function getSelection(filesURL) {
  if (isDev) {
    return sampleData;
  } else {
    return fetch(filesURL).then((res) => res.json());
  }
}

const API = isDev ? "/api" : "/hackathon-demo";
const loading = ref(true)

async function getImages(ids) {
  if (isDev)
    return [
      {
        docID: "KO00000094",
        url: "https://source.unsplash.com/random/300x300/?Barefoot,Contessa,Cookbook",
        mime: "application/pdf",
        error: false,
      },
      {
        docID: "KO00000093",
        url: "https://source.unsplash.com/random/300x300/?King,Arthur,Unbleached",
        mime: "application/pdf",
        error: false,
      },
      {
        docID: "KO00000090",
        url: "https://source.unsplash.com/random/300x300/?cook,minutes,Add",
        mime: "application/pdf",
        error: false,
      },
      {
        docID: "KO00000088",
        url: "https://source.unsplash.com/random/300x300/?Spicy,Add,chickpeas",
        mime: "application/pdf",
        error: false,
      },
      {
        docID: "KO00000086",
        url: "https://source.unsplash.com/random/300x300/?Prosciutto,Walnuts,Parmesan",
        mime: "application/pdf",
        error: false,
      },
    ];
  const body = JSON.stringify({ documents: ids });
  return fetch(API + "/listimages", {
    method: "Post",
    body,
    headers: {
      Accept: "application/hal+json",
      "Content-Type": "application/hal+json",
    },
  }).then((res) => res.json());
}

if (filesURL) {
  getSelection(filesURL)
    .then(mapIDs)
    .then(getImages)
    .then((items) => {
      loading.value = false
      files.value = [...items]
    });
}
</script>

<template>
  <main class="container-fluid">
    <span>Content Explorer</span>
    <a href="#" v-show="loading" :aria-busy="loading">Generating content, please wait…</a>

    <article :v-if="!loading" class="flexy">
      <Images
        v-for="image in files"
        :key="image.docID"
        :docID="image.docID"
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
  gap: 2rem;
}
body {
  padding-top: 2rem;
}
</style>
