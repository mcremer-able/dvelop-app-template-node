<template>
     <div class="fancy-card-grid">
      <a :href="dmsLink" class="fancy-card">
        <div class="imageandtext">
          <span class="fancy-card__number" aria-hidden="true">{{mime}}</span>
          <img v-if="loading" src="https://via.placeholder.com/300" alt="">

          <img v-show="!loading" @load="loading = false" :src="url" alt="" />
        </div>
      </a>
    </div>
</template>

<script>
export default {
    props:["url","mime","docID"],
    data(){
        return { loading:true}
    },
    computed:{
        dmsLink(){
            return `/dms/r/0dbdff0f-ae8d-495e-a158-29a1d2a3bc82/o2/${this.docID}`
        }
    }
};
</script>

<style lang="scss">
/* ------------------ */
/* Custom Properties  */
/* ------------------ */

.fancy-card__number{
    position: absolute;
    top:0;
    right:0;
}

.imageandtext {
  position: relative;
  margin-inline-end: auto;
  margin-inline-start: auto;  
  & > span{
      padding-inline-end: 0.5em;
  }
}

img {
  max-width: min(100% - 3rem, 66rem);

}

:root {
  --clr-neutral-900: hsl(0, 0%, 9%);
  --clr-neutral-400: hsl(210, 1%, 64%);
  --clr-neutral-100: hsl(210, 20%, 94%);

  --clr-primary: hsl(12, 74%, 50%);
}

/* ---------------- */
/* Reset            */
/* ---------------- */

/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ------------------ */
/* Base Styles  */
/* ------------------ */


h1,
h2,
h3 {
  font-weight: 400;
}

/* ------------------ */
/* Fancy Card Styles  */
/* ------------------ */

.fancy-card-grid,
.credits {
  /* just for demo */
 // margin: 6rem auto;
  width: min(100% - 2rem, 70rem);
}



.fancy-card {
  text-decoration: none;
  color: inherit;
  padding: 0.4rem;
  display: grid;
  border: 1px solid var(--clr-neutral-400);
  border-bottom: 5px solid var(--clr-primary);
  aspect-ratio: 1 / 1;
  grid-row: 2;

  &__number {
    color: var(--clr-primary);
    width: min-content;
    margin-left: auto;
  }

  &__title {
    font-size: 2rem;
    line-height: 1;
    width: min-content;
    margin-top: auto;
  }

  &--large {
    aspect-ratio: 1 / 1;
  }

  &--offset-up {
    grid-row: 1 / span 2;
  }

  &--offset-down {
    grid-row: 2 / span 2;
  }

  &:hover,
  &:focus {
    background: var(--clr-neutral-900);
    transform: scale(1.35);
    border: 0;
    z-index: 99999;

    .fancy-card__title {
      color: var(--clr-neutral-100);
    }
  }

  svg,
  &__arrow {
    display: none;
  }
}

.credits {
  margin: 6rem auto;
}
</style>