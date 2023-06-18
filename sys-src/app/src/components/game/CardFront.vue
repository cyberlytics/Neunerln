<template>
 <div class="card">
   <img class="oth-logo" src="../../assets/oth-aw.png" alt="" />
   <img class="oth-logo" src="../../assets/oth-aw.png" alt="" />
   <img class="color-image color-img-top" :src="color" alt="" />
   <img class="color-image color-img-bottom" :src="color" alt="" />

   <div class="value-color">
     <span>{{ value }}</span>
     <div><img class="img-corner" :src="color" /></div>
   </div>
   <div class="value-color">
     <span>{{ value }}</span>
     <div><img class="img-corner" :src="color" /></div>
   </div>
   <div class="value-color">
     <span>{{ value }}</span>
     <div><img class="img-corner" :src="color" /></div>
   </div>
   <div class="value-color">
     <span>{{ value }}</span>
     <div><img class="img-corner" :src="color" /></div>
   </div>
   
   <div class="card-line-orange"></div>
   <div class="card-line"></div>
   <div class="card-border"></div>
   <div class="descrip">
     <span class="description">{{ descrip }}</span>
   </div>
   <img class="back-card" :src="back" alt="" />
 </div>
</template>

<script setup lang="ts">
const props = defineProps({
 value: String,
 color: String,
 descrip: String,
 back: String
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
 height: 14rem;
 width: 8rem;
 border-radius: 10px;
 border: 0.1rem solid black;
 display: flex;
 justify-content: center;
 align-items: center;
 /*position: relative; */
 font-size: 20px;
 /* margin-right: 10px; */
 background: white;
 z-index: 3;
}

.back-card {
  position: absolute;
  height: 13.2rem;
  /* width: 7.2rem; */
  z-index: 2;
}

.descrip {
 height: 7.6rem;
 /* border-top: 0.1rem solid black;
 border-bottom: 0.1rem solid black; */
 display: flex;
 justify-content: center;
 align-items: center;
 font-size: 12px;
 background: #f7bc60;

 z-index: 2;
}

.description {
 /* background: white; */
 z-index: 2;
}
.value-color {
 position: absolute;
 padding-top: 0.2rem;
 background: white;
 text-align: center;
 z-index: 1;
}
.value-color span {
 transform: scale(0.9, 1.3);
 display: inline-block;
 font-family: 'Angsana New';
 /* letter-spacing: -1px; */
 
 font-weight: bold;
 color: black;
}
.value-color:nth-of-type(1) {
 top: 1rem;
 left: 0.3rem;
}
.value-color:nth-of-type(2) {
 top: 1rem;
 right: 0.3rem;
}
.value-color:nth-of-type(3) {
 bottom: 1rem;
 left: 0.3rem;
 transform: rotate(180deg);
}
.value-color:nth-of-type(4) {
 bottom: 1rem;
 right: 0.3rem;
 transform: rotate(180deg);
}
.img-corner {
 padding-top: 0.3rem;
 padding-left: 0.1rem;
 width: 1rem;
}
.oth-logo {
 position: absolute;
 width: 2rem;
 opacity: 0.8;
}
.oth-logo:nth-of-type(1) {
 top: 1.3rem;
}
.oth-logo:nth-of-type(2) {
 bottom: 1.3rem;
 transform: rotate(180deg);
}
.color-image {
 position: absolute;
 height: 3.5rem;
}
.color-image.color-img-top {
 top: 3rem;
}
.color-image.color-img-bottom {
 bottom: 3rem;
 transform: rotate(180deg);
}
.card-line {
 position: absolute;
 top: 6.95rem;
 height: 0.1rem;
 width: 6.4rem;
 /* background-color: black; */
}
.card-border {
 position: absolute;
 height: 12.4rem;
 width: 6.4rem;
 border-radius: 12px;
 border: 0.1rem solid black;
}

.card-line-orange {
  position: absolute;
 top: 6.9rem;
 height: 0.2rem;
 width: 6.4rem;
 background-image:linear-gradient( #f4aa3268 15%, black 70%, #f4a932 15%)
}
</style>
