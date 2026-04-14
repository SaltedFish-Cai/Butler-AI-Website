<!-- <style>
.fix-box {
  transform: translateZ(1);
  height: 500px;
}
.cuboid {
  width: 100%;
  height: 100%;
  position: relative;
}
.cuboid__side:nth-of-type(1) {
  height: calc(var(--thickness) * 1vmin);
  width: 100%;
  position: absolute;
  top: 0;
  transform: translate(0, -50%) rotateX(90deg);
}
.cuboid__side:nth-of-type(2) {
  height: 100%;
  width: calc(var(--thickness) * 1vmin);
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%) rotateY(90deg);
}
.cuboid__side:nth-of-type(3) {
  width: 100%;
  height: calc(var(--thickness) * 1vmin);
  position: absolute;
  bottom: 0;
  transform: translate(0%, 50%) rotateX(90deg);
}
.cuboid__side:nth-of-type(4) {
  height: 100%;
  width: calc(var(--thickness) * 1vmin);
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%) rotateY(90deg);
}
.cuboid__side:nth-of-type(5) {
  height: 100%;
  width: 100%;
  transform: translate3d(0, 0, calc(var(--thickness) * 0.5vmin));
  position: absolute;
  top: 0;
  left: 0;
}
.cuboid__side:nth-of-type(6) {
  height: 100%;
  width: 100%;
  transform: translate3d(0, 0, calc(var(--thickness) * -0.5vmin)) rotateY(180deg);
  position: absolute;
  top: 0;
  left: 0;
}
*,
*:after,
*:before {
  box-sizing: border-box;
  transform-style: preserve-3d;
  transition: background 0.25s;
}
:root {
  --base-size: 20;
  --helicopter-height: calc(var(--base-size) * 1vmin);
  --helicopter-width: calc(var(--helicopter-height) * 2);
  --helicopter-one: hsl(0, 0%, calc((60 + (var(--on, 0) * 35)) * 1%));
  --helicopter-two: hsl(0, 0%, calc((55 + (var(--on, 0) * 35)) * 1%));
  --helicopter-three: hsl(0, 0%, calc((50 + (var(--on, 0) * 35)) * 1%));
  --helicopter-four: hsl(0, 0%, calc((40 + (var(--on, 0) * 35)) * 1%));
  --chair-one: hsl(0, 0%, calc((20 + (var(--on, 0) * 15)) * 1%));
  --chair-two: hsl(0, 0%, calc((15 + (var(--on, 0) * 15)) * 1%));
  --chair-three: hsl(0, 0%, calc((10 + (var(--on, 0) * 15)) * 1%));
  --chair-four: hsl(0, 0%, calc((5 + (var(--on, 0) * 15)) * 1%));
  --dash-one: hsl(0, 0%, calc((50 + (var(--on, 0) * 15)) * 1%));
  --dash-two: hsl(0, 0%, calc((45 + (var(--on, 0) * 15)) * 1%));
  --dash-three: hsl(0, 0%, calc((40 + (var(--on, 0) * 15)) * 1%));
  --dash-four: hsl(0, 0%, calc((35 + (var(--on, 0) * 15)) * 1%));
  --accent-one: hsl(10, 60%, calc((30 + (var(--on, 0) * 35)) * 1%));
  --accent-two: hsl(10, 60%, calc((25 + (var(--on, 0) * 35)) * 1%));
  --accent-three: hsl(10, 60%, calc((20 + (var(--on, 0) * 35)) * 1%));
  --accent-four: hsl(10, 60%, calc((15 + (var(--on, 0) * 35)) * 1%));
  --rocket-one: hsl(1, 60%, calc((20 + (var(--on, 0) * 25)) * 1%));
  --rocket-two: hsl(1, 60%, calc((15 + (var(--on, 0) * 25)) * 1%));
  --rocket-three: hsl(1, 60%, calc((10 + (var(--on, 0) * 25)) * 1%));
  --rocket-four: hsl(1, 60%, calc((5 + (var(--on, 0) * 25)) * 1%));
  --screen-one: hsla(210, 80%, calc((25 + (var(--on, 0) * 25)) * 1%), 0.45);
  --screen-two: hsla(210, 80%, calc((25 + (var(--on, 0) * 25)) * 1%), 0.4);
  --screen-three: hsla(210, 80%, calc((25 + (var(--on, 0) * 25)) * 1%), 0.35);
  --screen-four: hsla(210, 80%, calc((25 + (var(--on, 0) * 25)) * 1%), 0.35);
  --bg: hsl(210, 80%, calc((15 + (var(--on, 0) * 75)) * 1%));
}

.scene {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 100vmin);
  transform: translate3d(-50%, -50%, 100vmin) rotateX(-24deg) rotateY(44deg) rotateX(calc(var(--rotate-x, 0) * 1deg))
    rotateY(calc(var(--rotate-y, 0) * 1deg));
}
.helicopter {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-20%, -50%);
}
.helicopter__wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-animation: float 1s infinite linear;
  animation: float 1s infinite linear;
  height: var(--helicopter-height);
  width: var(--helicopter-width);
}
@-webkit-keyframes float {
  50% {
    transform: translate(-50%, -65%);
  }
}
@keyframes float {
  50% {
    transform: translate(-50%, -65%);
  }
}
.helicopter__base-light {
  --hue: 20;
  bottom: -6%;
  width: 6%;
  height: 6%;
  left: 47%;
  position: absolute;
}
.helicopter__tail-light {
  --hue: 15;
  top: -20%;
  width: 20%;
  height: 20%;
  position: absolute;
  left: 65%;
}
.helicopter__wing-light {
  --hue: 90;
  --speed: 0.4;
  top: -50%;
  width: 10%;
  height: 50%;
  position: absolute;
  left: 45%;
}
.helicopter__wing-light--left {
  transform: translate3d(0, 0, calc(var(--base-size) * 0.5vmin));
}
.helicopter__wing-light--right {
  transform: translate3d(0, 0, calc(var(--base-size) * -0.5vmin));
}
.helicopter > * {
  position: absolute;
}
.helicopter__rotor {
  top: 0;
  left: 30%;
  height: 14%;
  width: 8%;
}
.helicopter__cockpit {
  left: 0;
  top: 14%;
  width: 54%;
  height: 70%;
}
.helicopter__tail {
  top: 30%;
  height: 20%;
  width: 46%;
  left: 54%;
}
.helicopter__fin {
  right: 2%;
  top: 10%;
  height: 20%;
  width: 10%;
}
.helicopter__stabilizer {
  right: 2%;
  top: 30%;
  height: 10%;
  width: 10%;
}
.helicopter__skids {
  bottom: 0;
  left: 0;
  height: 6%;
  width: 70%;
}
.helicopter__wing {
  height: 6%;
  width: 22%;
  left: 28%;
  top: 60%;
}
.helicopter__launchers {
  height: 10%;
  width: 18%;
  left: 30%;
  top: 66%;
}
.helicopter__chair {
  position: absolute;
  left: 18%;
  top: 30%;
  width: 28%;
  height: 58%;
}
.helicopter__chair-back {
  position: absolute;
  width: 25%;
  right: 0;
  top: 0;
  height: 100%;
}
.helicopter__chair-bottom {
  position: absolute;
  height: 20%;
  right: 0;
  bottom: 0;
  width: 80%;
}
.helicopter__launcher {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.helicopter__launcher--left {
  transform: translate3d(0, 0, calc(var(--base-size) * -0.425vmin));
}
.helicopter__launcher--right {
  transform: translate3d(0, 0, calc(var(--base-size) * 0.425vmin));
}
.helicopter__triblade {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 50%;
  top: 50%;
  transform: translate3d(-25%, -75%, calc(var(--base-size) * 0.07vmin)) scale(1.25);
  border-radius: 50%;
  overflow: hidden;
  -webkit-animation: rotate-tri 0.2s infinite linear;
  animation: rotate-tri 0.2s infinite linear;
}
.helicopter__triblade:after,
.helicopter__triblade:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 15%;
  background: var(--chair-four);
  transform: translate(-50%, -50%);
}
.helicopter__triblade:after {
  transform: translate(-50%, -50%) rotate(90deg);
}
@-webkit-keyframes rotate-tri {
  to {
    transform: translate3d(-25%, -75%, calc(var(--base-size) * 0.07vmin)) scale(1.25) rotate(-360deg);
  }
}
@keyframes rotate-tri {
  to {
    transform: translate3d(-25%, -75%, calc(var(--base-size) * 0.07vmin)) scale(1.25) rotate(-360deg);
  }
}
.helicopter__blades {
  height: calc(var(--helicopter-height) * 2);
  width: calc(var(--helicopter-height) * 2);
  left: 34%;
  top: 0%;
  transform: translate(-50%, -50%) rotateX(90deg) translate3d(0, 0, 1px);
  border-radius: 50%;
  overflow: hidden;
  -webkit-animation: blades infinite 0.1s linear;
  animation: blades infinite 0.1s linear;
}
.helicopter__blades:after,
.helicopter__blades:before {
  content: "";
  height: 100%;
  width: 10%;
  background: linear-gradient(
    var(--chair-one) 0 5%,
    var(--accent-one) 5% 10%,
    var(--chair-one) 10% 90%,
    var(--accent-one) 90% 95%,
    var(--chair-one) 95% 100%
  );
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.helicopter__blades:after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.helicopter__skid {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.helicopter__skid:after,
.helicopter__skid:before {
  content: "";
  position: absolute;
  left: 16%;
  width: 4%;
  bottom: 0;
  height: 400%;
  background: var(--chair-four);
  transform-origin: 50% 100%;
  transform: rotateX(calc(25 * var(--coefficient, 1deg)));
}
.helicopter__skid:before {
  left: 56%;
}
.helicopter__skid--left {
  transform: translate3d(0, 0, calc(var(--base-size) * 0.4vmin));
}
.helicopter__skid--right {
  --coefficient: -1deg;
  transform: translate3d(0, 0, calc(var(--base-size) * -0.4vmin));
}
.helicopter__dashboard {
  position: absolute;
  left: 2%;
  top: 50%;
  width: 16%;
  height: 38%;
}
@-webkit-keyframes shift {
  0%,
  10%,
  90%,
  100% {
    transform: translate(-20%, -50%) translate3d(0, 0, 0);
  }
  20%,
  50% {
    transform: translate(-20%, -50%) translate3d(0, 0, 10vmin);
  }
  60%,
  80% {
    transform: translate(-20%, -50%) translate3d(0, 0, -10vmin);
  }
}
@keyframes shift {
  0%,
  10%,
  90%,
  100% {
    transform: translate(-20%, -50%) translate3d(0, 0, 0);
  }
  20%,
  50% {
    transform: translate(-20%, -50%) translate3d(0, 0, 10vmin);
  }
  60%,
  80% {
    transform: translate(-20%, -50%) translate3d(0, 0, -10vmin);
  }
}
.cuboid--cockpit {
  --thickness: calc(var(--base-size) * 0.6);
}
.cuboid--cockpit div {
  background: var(--helicopter-four);
}
.cuboid--cockpit div:nth-of-type(1) {
  background: linear-gradient(90deg, var(--screen-one) 0 50%, var(--helicopter-one) 50% 100%) 50% 50%/100% 100% no-repeat;
}
.cuboid--cockpit div:nth-of-type(2):after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: calc(100% - 1px);
  width: calc(100% - 1px);
  background: #914db3;
  transform: translate3d(-50%, -50%, calc(var(--helicopter-width) * -0.27));
}
.cuboid--cockpit div:nth-of-type(4) {
  background: transparent;
  background: linear-gradient(var(--screen-two) 0% 80%, var(--helicopter-one) 80% 100%) 50% 50%/100% 100% no-repeat;
}
.cuboid--cockpit div:nth-of-type(5) {
  background: transparent;
  background: linear-gradient(var(--helicopter-three), var(--helicopter-three)) 100% 50%/50% 100% no-repeat,
    linear-gradient(var(--screen-three) 0% 80%, var(--helicopter-three) 80% 100%) 0% 50%/50% 100% no-repeat;
}
.cuboid--cockpit div:nth-of-type(5):after {
  content: "";
  position: absolute;
  top: 50%;
  height: 50%;
  width: 25%;
  right: 15%;
  transform: translate3d(0%, -60%, 1px) scale(0.75);
  filter: saturate(0.5);
}
.cuboid--cockpit div:nth-of-type(6) {
  background: transparent;
  background: linear-gradient(var(--helicopter-two), var(--helicopter-two)) 0 50%/50% 100% no-repeat,
    linear-gradient(var(--screen-four) 0% 80%, var(--helicopter-two) 80% 100%) 100% 50%/50% 100% no-repeat;
}
.cuboid--cockpit div:nth-of-type(6):after {
  content: "";
  position: absolute;
  top: 50%;
  height: 50%;
  width: 25%;
  left: 15%;
  transform: translate3d(0%, -60%, 1px) scale(0.75);
  filter: saturate(0.5);
}
.cuboid--tail {
  --thickness: calc(var(--base-size) * 0.4);
  --clip: polygon(0 0, 100% 40%, 100% 60%, 0 100%);
}
.cuboid--tail div {
  background: var(--accent-four);
}
.cuboid--tail div:nth-of-type(1) {
  background: var(--accent-one);
  -webkit-clip-path: var(--clip);
  clip-path: var(--clip);
}
.cuboid--tail div:nth-of-type(2) {
  background: var(--accent-one);
  background: linear-gradient(90deg, transparent 0 40%, var(--accent-four) 40% 60%, transparent 60% 100%);
}
.cuboid--tail div:nth-of-type(3) {
  background: var(--accent-two);
  -webkit-clip-path: var(--clip);
  clip-path: var(--clip);
}
.cuboid--tail div:nth-of-type(4) {
  background: var(--accent-three);
}
.cuboid--tail div:nth-of-type(5) {
  background: transparent;
}
.cuboid--tail div:nth-of-type(5):after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--accent-three);
  transform-origin: 0 50%;
  transform: rotateY(10deg);
}
.cuboid--tail div:nth-of-type(6) {
  background: transparent;
}
.cuboid--tail div:nth-of-type(6):after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--accent-three);
  transform-origin: 100% 50%;
  transform: rotateY(-10deg);
}
.cuboid--stabilizer {
  --thickness: calc(var(--base-size) * 0.4);
}
.cuboid--stabilizer div {
  background: var(--helicopter-four);
}
.cuboid--stabilizer div:nth-of-type(1) {
  background: var(--helicopter-one);
}
.cuboid--stabilizer div:nth-of-type(3) {
  background: var(--helicopter-two);
}
.cuboid--stabilizer div:nth-of-type(4) {
  background: var(--helicopter-three);
}
.cuboid--fin {
  --thickness: calc(var(--base-size) * 0.1);
}
.cuboid--fin div {
  background: var(--helicopter-four);
}
.cuboid--fin div:nth-of-type(1) {
  background: linear-gradient(90deg, transparent 0 50%, var(--helicopter-one) 50% 100%);
}
.cuboid--fin div:nth-of-type(3) {
  background: var(--helicopter-two);
}
.cuboid--fin div:nth-of-type(4) {
  background: transparent;
}
.cuboid--fin div:nth-of-type(4):after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  background: var(--helicopter-two);
  height: 110%;
  width: 100%;
  transform-origin: 50% 100%;
  transform: rotateX(-24deg);
}
.cuboid--fin div:nth-of-type(5) {
  background: var(--helicopter-three);
  --clip: polygon(0 100%, 50% 0, 100% 0, 100% 100%);
  -webkit-clip-path: var(--clip);
  clip-path: var(--clip);
}
.cuboid--fin div:nth-of-type(6) {
  background: var(--helicopter-three);
  --clip: polygon(0 0%, 50% 0, 100% 100%, 0 100%);
  -webkit-clip-path: var(--clip);
  clip-path: var(--clip);
}
.cuboid--skid {
  --thickness: calc(var(--base-size) * 0.06);
}
.cuboid--skid div {
  background: var(--chair-four);
}
.cuboid--skid div:nth-of-type(1) {
  background: var(--chair-one);
}
.cuboid--skid div:nth-of-type(3) {
  background: var(--chair-two);
}
.cuboid--skid div:nth-of-type(4) {
  background: var(--chair-three);
}
.cuboid--dashboard {
  --thickness: calc(var(--base-size) * 0.52);
}
.cuboid--dashboard div {
  background: var(--dash-four);
}
.cuboid--dashboard div:nth-of-type(1) {
  background: var(--dash-one);
}
.cuboid--dashboard div:nth-of-type(3) {
  background: var(--dash-two);
}
.cuboid--dashboard div:nth-of-type(4) {
  background: var(--dash-three);
}
.cuboid--chair {
  --thickness: calc(var(--base-size) * 0.4);
}
.cuboid--chair div {
  background: var(--chair-four);
}
.cuboid--chair div:nth-of-type(1) {
  background: var(--chair-one);
}
.cuboid--chair div:nth-of-type(3) {
  background: var(--chair-two);
}
.cuboid--chair div:nth-of-type(4) {
  background: var(--chair-three);
}
.cuboid--wing {
  --thickness: calc(var(--base-size) * 1.1);
}
.cuboid--wing div {
  background: var(--accent-four);
}
.cuboid--wing div:nth-of-type(1) {
  background: var(--accent-one);
}
.cuboid--wing div:nth-of-type(3) {
  background: var(--accent-two);
}
.cuboid--wing div:nth-of-type(4) {
  background: var(--accent-three);
}
.cuboid--rotor {
  --thickness: calc(var(--base-size) * 0.14);
}
.cuboid--rotor div {
  background: var(--dash-four);
}
.cuboid--rotor div:nth-of-type(1) {
  background: var(--dash-one);
}
.cuboid--rotor div:nth-of-type(3) {
  background: var(--dash-two);
}
.cuboid--rotor div:nth-of-type(4) {
  background: var(--dash-three);
}
.cuboid--launcher {
  --thickness: calc(var(--base-size) * 0.08);
}
.cuboid--launcher div {
  background: var(--rocket-four);
}
.cuboid--launcher div:nth-of-type(1) {
  background: var(--rocket-one);
}
.cuboid--launcher div:nth-of-type(3) {
  background: var(--rocket-two);
}
.cuboid--launcher div:nth-of-type(4) {
  background: var(--rocket-three);
}
.cuboid--light {
  --thickness: calc(var(--base-size) * 0.035);
  -webkit-animation: flash calc((1 - var(--on, 0)) * (var(--speed, 1) * 1s)) infinite;
  animation: flash calc((1 - var(--on, 0)) * (var(--speed, 1) * 1s)) infinite;
}
.cuboid--light div {
  background: hsla(var(--hue, 10), 90%, 50%, var(--alpha, 0));
}
.helicopter__ammo {
  height: 50%;
  width: 30%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
}
.cuboid--ammo {
  --thickness: calc(var(--base-size) * 0.05);
}
.cuboid--ammo div {
  background: hsl(var(--hue), 80%, 80%);
}
button {
  height: 48px;
  width: 48px;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  cursor: pointer;
  transform: translate3d(0, 0, 150vmin);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 0;
  background: transparent;
  outline: transparent;
}
button > svg {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
button path {
  fill: hsl(210, 80%, calc((90 - (var(--on, 0) * 75)) * 1%));
}
button svg:nth-of-type(1),
button span:nth-of-type(1) {
  display: none;
}
button span {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
[aria-pressed="true"] svg:nth-of-type(1),
[aria-pressed="true"] span:nth-of-type(1) {
  display: block;
}
[aria-pressed="true"] svg:nth-of-type(2),
[aria-pressed="true"] span:nth-of-type(2) {
  display: none;
}
@-webkit-keyframes blades {
  to {
    transform: translate(-50%, -50%) rotateX(90deg) translate3d(0, 0, 1px) rotate(-360deg);
  }
}
@keyframes blades {
  to {
    transform: translate(-50%, -50%) rotateX(90deg) translate3d(0, 0, 1px) rotate(-360deg);
  }
}
@-webkit-keyframes flash {
  50% {
    --alpha: 1;
  }
}
@keyframes flash {
  50% {
    --alpha: 1;
  }
}
</style>

<template>
  <div id="fix-box" class="fix-box">
    <div class="scene">
      <div class="helicopter__tilter">
        <div class="helicopter__wrapper">
          <div class="helicopter">
            <div class="helicopter__rotor">
              <div class="cuboid cuboid--rotor">
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
              </div>
            </div>
            <div class="helicopter__cockpit">
              <div class="cuboid cuboid--cockpit">
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
              </div>
              <div class="helicopter__base-light">
                <div class="cuboid cuboid--base-light cuboid--light">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
              <div class="helicopter__chair">
                <div class="helicopter__chair-back">
                  <div class="cuboid cuboid--chair">
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                  </div>
                </div>
                <div class="helicopter__chair-bottom">
                  <div class="cuboid cuboid--chair">
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                    <div class="cuboid__side"></div>
                  </div>
                </div>
              </div>
              <div class="helicopter__dashboard">
                <div class="cuboid cuboid--dashboard">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
            </div>
            <div class="helicopter__tail">
              <div class="cuboid cuboid--tail">
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
              </div>
            </div>
            <div class="helicopter__fin">
              <div class="cuboid cuboid--fin">
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
              </div>
              <div class="helicopter__triblade"></div>
              <div class="helicopter__tail-light">
                <div class="cuboid cuboid--tail-light cuboid--light">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
            </div>
            <div class="helicopter__stabilizer">
              <div class="cuboid cuboid--stabilizer">
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
              </div>
            </div>
            <div class="helicopter__skids">
              <div class="helicopter__skid--left helicopter__skid">
                <div class="cuboid cuboid--skid">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
              <div class="helicopter__skid--right helicopter__skid">
                <div class="cuboid cuboid--skid">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
            </div>
            <div class="helicopter__wing">
              <div class="cuboid cuboid--wing">
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
                <div class="cuboid__side"></div>
              </div>
              <div class="helicopter__wing-light helicopter__wing-light--left">
                <div class="cuboid cuboid--wing-light cuboid--light">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
              <div class="helicopter__wing-light helicopter__wing-light--right">
                <div class="cuboid cuboid--wing-light cuboid--light">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
            </div>
            <div class="helicopter__launchers">
              <div class="helicopter__launcher helicopter__launcher--left">
                <div class="cuboid cuboid--launcher">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
              <div class="helicopter__launcher helicopter__launcher--right">
                <div class="cuboid cuboid--launcher">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
            </div>
            <div class="helicopter__blades"></div>
          </div>
        </div>
      </div>
    </div>
    <button title="Toggle theme">
      <span>Turn Lights Off</span><span>Turn Lights On</span>
      <svg viewBox="0 0 512 512" width="100" title="moon">
        <path
          d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"
        ></path>
      </svg>
      <svg viewBox="0 0 512 512" width="100" title="sun">
        <path
          d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script type="ts" setup>
import { onMounted, onUnmounted } from "vue";
import gsap from "https://cdn.skypack.dev/gsap@3.11.0";
import inBrowser from "../../../../src/package/components/tools/inBrowser";
let FIRING = false;
const BOUNDS = 25;
let watchDoc;

function mousemoveFn({ x, y }){
  const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x);
  const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y);
  const doc = document.querySelector("#fix-box");
    gsap.set(doc, {
    "--rotate-x": newY,
    "--rotate-y": newX
  });
}

onMounted(() => {
  if (inBrowser) {
    document.addEventListener("mousemove", mousemoveFn);
    const LEFT_LAUNCHER = document.querySelector(".helicopter__launcher--left");
    const RIGHT_LAUNCHER = document.querySelector(".helicopter__launcher--right");

    gsap.ticker.add((time, deltaTime, frame) => {
      if (FIRING) {
        const AMMO = document.createElement("div");
        AMMO.innerHTML = `
      <div class="cuboid cuboid--ammo">
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
      </div>
    `;
        AMMO.className = "helicopter__ammo";
        AMMO.style.setProperty("--hue", Math.random() * 360);
        if (frame % 2 === 0) LEFT_LAUNCHER.appendChild(AMMO);
        else RIGHT_LAUNCHER.appendChild(AMMO);

        gsap.to(AMMO, {
          xPercent: () => gsap.utils.random(-3000, -2000),
          // duration: 0.2,
          onComplete: () => AMMO.remove()
        });
      }
    });

    gsap.ticker.fps(24);

    document.addEventListener("pointerdown", () => {
      FIRING = true;
    });
    document.addEventListener("pointerup", () => {
      FIRING = false;
    });

    // Purely for debugging purposes
    // import { GUI } from 'https://cdn.skypack.dev/dat.gui'

    // const CONTROLLER = new GUI()
    // const CONFIG = {
    //   'rotate-x': -360,
    //   'rotate-y': -360,
    // }
    // const UPDATE = () => {
    //   Object.entries(CONFIG).forEach(([key, value]) => {
    //     document.documentElement.style.setProperty(`--${key}`, value)
    //   })
    // }
    // const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
    // PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
    //   .name('Rotate X (deg)')
    //   .onChange(UPDATE)
    // PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
    //   .name('Rotate Y (deg)')
    //   .onChange(UPDATE)
    // UPDATE()

    // Dark Mode
    const THEMES = (window.THEMES = {
      LIGHT: "LIGHT",
      DARK: "DARK",
      KEY: "THEME"
    });

    window.LIGHT_QUERY = window.matchMedia("(prefers-color-scheme: light)"); // Mode enums

    window.__setTheme = theme => {
      window.__THEME = theme;
      window.localStorage.setItem(THEMES.KEY, theme);
    }; // Need to check the box based on different criteria.
    // Check if mode is Light and preference is dark or no preference.

    const stored = localStorage.getItem(THEMES.KEY);

    if (stored) {
      window.__THEME = stored;
      window.__setTheme(stored);
    } else {
      if (window.LIGHT_QUERY.matches) {
        window.__THEME = THEMES.LIGHT;
      } else {
        window.__THEME = THEMES.DARK;
      }

      window.__setTheme(window.__THEME);
    }

    window.INITIAL_THEME =
      (window.__THEME && window.__THEME === THEMES.LIGHT) ||
      (window.localStorage.getItem(THEMES.KEY) && window.localStorage.getItem(THEMES.KEY) === THEMES.LIGHT);

    const BUTTON = document.querySelector("button");

    gsap.set(BUTTON, {
      attr: {
        "aria-pressed": window.__THEME === THEMES.DARK ? "false" : "true"
      }
    });

    gsap.set("html", {
      "--on": window.__THEME === THEMES.DARK ? 0 : 1
    });

    BUTTON.addEventListener("click", () => {
      const NEW_THEME = window.__THEME === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      window.__setTheme(NEW_THEME);
      gsap.set("button", {
        attr: {
          "aria-pressed": NEW_THEME === THEMES.DARK ? "false" : "true"
        }
      });

      gsap.set("html", {
        "--on": window.__THEME === THEMES.DARK ? 0 : 1
      });
    });
  }
});
onUnmounted(() => {
  if (inBrowser) {
    document.removeEventListener("mousemove",mousemoveFn);
  }
});
</script> -->
<template>
  <div id="animation-container" class="animation-container">
    <svg class="animation-rainbow-cat" viewBox="0 0 70 20">
      <defs>
        <linearGradient id="rainbow-colors" x1="0.5" x2="0.5" y2="1">
          <stop class="rainbow-color1" offset="0"></stop>
          <stop class="rainbow-color1" offset="0.167"></stop>
          <stop class="rainbow-color2" offset="0.167"></stop>
          <stop class="rainbow-color2" offset="0.335"></stop>
          <stop class="rainbow-color3" offset="0.335"></stop>
          <stop class="rainbow-color3" offset="0.5"></stop>
          <stop class="rainbow-color4" offset="0.5"></stop>
          <stop class="rainbow-color4" offset="0.669"></stop>
          <stop class="rainbow-color5" offset="0.669"></stop>
          <stop class="rainbow-color5" offset="0.833"></stop>
          <stop class="rainbow-color6" offset="0.833"></stop>
          <stop class="rainbow-color6" offset="1"></stop>
        </linearGradient>
      </defs>
      <g class="rainbow-cat">
        <g class="rainbow">
          <rect></rect>
          <rect></rect>
          <rect></rect>
          <rect></rect>
          <rect></rect>
          <rect></rect>
          <rect></rect>
        </g>
        <g class="cat">
          <g class="cat-tail" transform="translate(40, 5.5)">
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
          </g>
          <g class="cat-legs" transform="translate(43, 5.5)">
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
          </g>
          <g class="cat-bread" transform="translate(43, 5.5)">
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
          </g>
          <g class="cat-head" transform="translate(43, 5.5)">
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
            <rect></rect>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style>
/* svg {
  mask-image: linear-gradient(to left, #000000 70%, #ffffff00 84%);
  -webkit-mask-image: linear-gradient(to left, #000000 70%, #ffffff00 84%);
  width: 400px;
} */

.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.animation-rainbow-cat {
  width: 300px;
  height: 200px;
}

.animation-rainbow-cat .rainbow-color1 {
  stop-color: #fc0101;
}

.animation-rainbow-cat .rainbow-color2 {
  stop-color: #fe9900;
}

.animation-rainbow-cat .rainbow-color3 {
  stop-color: #ffff00;
}

.animation-rainbow-cat .rainbow-color4 {
  stop-color: #33ff00;
}

.animation-rainbow-cat .rainbow-color5 {
  stop-color: #0099ff;
}

.animation-rainbow-cat .rainbow-color6 {
  stop-color: #6734ff;
}

.animation-rainbow-cat .rainbow-cat .rainbow rect {
  width: 5px;
  stroke: transparent;
  fill: url(./readme.html#rainbow-colors);
}

/* Bagian Pelangi */

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(1) {
  height: 7px;
  transform: translate(40px, 6px);
  animation: rainbow-boost-1 0.2s linear 0.2s infinite alternate;
}
@keyframes rainbow-boost-1 {
  to {
    transform: translate(40px, 7px);
  }
}

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(2) {
  height: 6.9px;
  transform: translate(35.1px, 5.8px);
  animation: rainbow-boost-2 0.2s linear 0.23s infinite alternate;
}
@keyframes rainbow-boost-2 {
  to {
    transform: translate(35.1px, 7.2px);
  }
}

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(3) {
  height: 6.7px;
  transform: translate(30.2px, 5.6px);
  animation: rainbow-boost-3 0.2s linear 0.26s infinite alternate;
}
@keyframes rainbow-boost-3 {
  to {
    transform: translate(30.2px, 7.4px);
  }
}

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(4) {
  height: 6.6px;
  transform: translate(25.3px, 5.5px);
  animation: rainbow-boost-4 0.2s linear 0.29s infinite alternate;
}
@keyframes rainbow-boost-4 {
  to {
    transform: translate(25.3px, 7.5px);
  }
}

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(5) {
  height: 6.4px;
  transform: translate(20.4px, 5.3px);
  animation: rainbow-boost-5 0.2s linear 0.32s infinite alternate;
}
@keyframes rainbow-boost-5 {
  to {
    transform: translate(20.4px, 7.7px);
  }
}

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(6) {
  height: 6.3px;
  transform: translate(15.6px, 5.1px);
  animation: rainbow-boost-6 0.2s linear 0.35s infinite alternate;
}
@keyframes rainbow-boost-6 {
  to {
    transform: translate(15.6px, 7.9px);
  }
}

.animation-rainbow-cat .rainbow-cat .rainbow rect:nth-of-type(7) {
  height: 6.2px;
  transform: translate(10.8px, 5px);
  animation: rainbow-boost-7 0.2s linear 0.38s infinite alternate;
}
@keyframes rainbow-boost-7 {
  to {
    transform: translate(10.8px, 8px);
  }
}

/* Bagian Roti */

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(1) {
  width: 9px;
  height: 9px;
  fill: black;
  transform: translate(1px, 0px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(2) {
  width: 11px;
  height: 7px;
  fill: black;
  transform: translate(0px, 1px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(3) {
  width: 10px;
  height: 8px;
  fill: black;
  transform: translate(0.5px, 0.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(4) {
  width: 10px;
  height: 7px;
  fill: #ffcd8e;
  transform: translate(0.5px, 1px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(5) {
  width: 9px;
  height: 8px;
  fill: #ffcd8e;
  transform: translate(1px, 0.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(6) {
  width: 8px;
  height: 6px;
  fill: #ff99ff;
  transform: translate(1.5px, 1.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(7) {
  width: 7px;
  height: 7px;
  fill: #ff99ff;
  transform: translate(2px, 1px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(8) {
  width: 9px;
  height: 5px;
  fill: #ff99ff;
  transform: translate(1px, 2px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(9) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(2px, 2px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(10) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(2px, 7px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(11) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(1.5px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(12) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(2.5px, 4.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(13) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(4px, 3.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(14) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(4.5px, 5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(15) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(3.5px, 6.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(16) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(4.5px, 1.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(17) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(6.5px, 1.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-bread rect:nth-of-type(18) {
  width: 0.5px;
  height: 0.5px;
  fill: #fd1a97;
  transform: translate(8.5px, 2.5px);
}

/* Bagian Buntut */

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(1) {
  width: 0.5px;
  height: 1.5px;
  fill: black;
  transform: translate(2.5px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(2) {
  width: 1.5px;
  height: 1.5px;
  fill: black;
  transform: translate(1.5px, 5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(3) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(1px, 4.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(4) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(0.5px, 4px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(5) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(0px, 3.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(6) {
  width: 1px;
  height: 0.6px;
  fill: #989898;
  transform: translate(2px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(7) {
  width: 1px;
  height: 0.6px;
  fill: #989898;
  transform: translate(1.5px, 5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(8) {
  width: 1px;
  height: 0.6px;
  fill: #989898;
  transform: translate(1px, 4.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(9) {
  width: 1px;
  height: 0.6px;
  fill: #989898;
  transform: translate(0.5px, 4px);
}

/* Bagian Kepala */

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(1) {
  width: 8px;
  height: 2.5px;
  fill: black;
  transform: translate(5px, 5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(2) {
  width: 7px;
  height: 4px;
  fill: black;
  transform: translate(5.5px, 4px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(3) {
  width: 6px;
  height: 4.5px;
  fill: black;
  transform: translate(6px, 4px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(4) {
  width: 5px;
  height: 5px;
  fill: black;
  transform: translate(6.5px, 4px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(5) {
  width: 2.5px;
  height: 1.5px;
  fill: black;
  transform: translate(5.5px, 3.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(6) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(5.5px, 3px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(7) {
  width: 1px;
  height: 1.5px;
  fill: black;
  transform: translate(6px, 2.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(8) {
  width: 2.5px;
  height: 1.5px;
  fill: black;
  transform: translate(10px, 3.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(9) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(10.5px, 3px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(10) {
  width: 1px;
  height: 1.5px;
  fill: black;
  transform: translate(11px, 2.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(11) {
  width: 7px;
  height: 2.5px;
  fill: #989898;
  transform: translate(5.5px, 5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(12) {
  width: 6px;
  height: 3.5px;
  fill: #989898;
  transform: translate(6px, 4.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(13) {
  width: 5px;
  height: 4px;
  fill: #989898;
  transform: translate(6.5px, 4.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(14) {
  width: 2px;
  height: 1.5px;
  fill: #989898;
  transform: translate(6px, 4px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(15) {
  width: 1.5px;
  height: 1.5px;
  fill: #989898;
  transform: translate(6px, 3.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(16) {
  width: 1px;
  height: 1.5px;
  fill: #989898;
  transform: translate(6px, 3px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(17) {
  width: 2px;
  height: 1.5px;
  fill: #989898;
  transform: translate(10px, 4px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(18) {
  width: 1.5px;
  height: 1.5px;
  fill: #989898;
  transform: translate(10.5px, 3.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(19) {
  width: 1px;
  height: 1.5px;
  fill: #989898;
  transform: translate(11px, 3px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(20) {
  width: 1px;
  height: 1px;
  fill: #ff9999;
  transform: translate(6px, 6.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(21) {
  width: 1px;
  height: 1px;
  fill: #ff9999;
  transform: translate(11.5px, 6.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(22) {
  width: 1px;
  height: 1px;
  fill: black;
  transform: translate(7px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(23) {
  width: 0.5px;
  height: 0.5px;
  fill: white;
  transform: translate(7px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(24) {
  width: 1px;
  height: 1px;
  fill: black;
  transform: translate(10.5px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(25) {
  width: 0.5px;
  height: 0.5px;
  fill: white;
  transform: translate(10.5px, 5.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(26) {
  width: 0.5px;
  height: 0.5px;
  fill: black;
  transform: translate(9.5px, 6px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(27) {
  width: 3.5px;
  height: 0.5px;
  fill: black;
  transform: translate(7.5px, 7.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(28) {
  width: 0.5px;
  height: 1px;
  fill: black;
  transform: translate(7.5px, 7px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(29) {
  width: 0.5px;
  height: 1px;
  fill: black;
  transform: translate(9px, 7px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head rect:nth-of-type(30) {
  width: 0.5px;
  height: 1px;
  fill: black;
  transform: translate(10.5px, 7px);
}

/* Bagian Kaki */

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(1) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(0px, 7.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(2) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(-0.5px, 8px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(3) {
  width: 2px;
  height: 1.5px;
  fill: black;
  transform: translate(-1px, 8.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(4) {
  width: 1.5px;
  height: 0.6px;
  fill: #989898;
  transform: translate(0.5px, 8px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(5) {
  width: 1.5px;
  height: 0.5px;
  fill: #989898;
  transform: translate(-0.5px, 8.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(6) {
  width: 1px;
  height: 1px;
  fill: #989898;
  transform: translate(-0.5px, 8.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(7) {
  width: 1.5px;
  height: 1px;
  fill: black;
  transform: translate(2px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(8) {
  width: 2px;
  height: 0.5px;
  fill: black;
  transform: translate(2px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(9) {
  width: 1px;
  height: 0.5px;
  fill: #989898;
  transform: translate(2.5px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(10) {
  width: 1.5px;
  height: 1px;
  fill: black;
  transform: translate(7px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(11) {
  width: 2px;
  height: 0.5px;
  fill: black;
  transform: translate(6.5px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(12) {
  width: 1px;
  height: 0.5px;
  fill: #989898;
  transform: translate(7px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(13) {
  width: 1px;
  height: 1px;
  fill: black;
  transform: translate(9.5px, 9px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(14) {
  width: 2px;
  height: 1px;
  fill: black;
  transform: translate(9px, 8.5px);
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(15) {
  width: 1px;
  height: 1px;
  fill: #989898;
  transform: translate(9.5px, 8.5px);
}

/* Animasi Seluruh Badan */

.animation-rainbow-cat .rainbow-cat .cat {
  animation: cat-move 0.35s linear 0.2s infinite;
}
@keyframes cat-move {
  50% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(0.3px, -0.5px);
  }
  100% {
    transform: translate(1px, 0px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-head {
  animation: cat-head-move 0.35s cubic-bezier(0.95, -0.11, 0.56, 0.67) 0.2s infinite;
}
@keyframes cat-head-move {
  0% {
    transform: translate(43.5px, 5px);
  }
  50% {
    transform: translate(44px, 5.5px);
  }
  100% {
    transform: translate(43px, 5.5px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs {
  animation: cat-legs-move 0.14s cubic-bezier(0.95, -0.11, 0.56, 0.67) 0.3s infinite alternate;
}
@keyframes cat-legs-move {
  from {
    transform: translate(43px, 5.5px);
  }
  to {
    transform: translate(42.5px, 5.5px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(7) {
  animation: cat-back-leg 0.42s cubic-bezier(0.94, -0.35, 0, 1.2) 0.3s infinite;
}
@keyframes cat-back-leg {
  to {
    transform: translate(2.5px, 9px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-legs rect:nth-of-type(10) {
  animation: cat-front-leg 0.42s cubic-bezier(0.94, -0.35, 0, 1.2) 0.3s infinite;
}
@keyframes cat-front-leg {
  to {
    transform: translate(6.5px, 9px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(2) {
  animation: cat-tail-1 0.4s ease-in-out 0.26s infinite alternate;
}
@keyframes cat-tail-1 {
  to {
    transform: translate(1.5px, 5.5px);
  }
}
.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(6) {
  animation: cat-tail-5 0.4s ease-in-out 0.264s infinite alternate;
}
@keyframes cat-tail-5 {
  to {
    transform: translate(2px, 6px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(3) {
  animation: cat-tail-2 0.4s ease-in-out 0.24s infinite alternate;
}
@keyframes cat-tail-2 {
  to {
    transform: translate(1px, 6px);
  }
}
.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(7) {
  animation: cat-tail-6 0.4s ease-in-out 0.244s infinite alternate;
}
@keyframes cat-tail-6 {
  to {
    transform: translate(1.5px, 6.5px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(4) {
  animation: cat-tail-3 0.4s ease-in-out 0.22s infinite alternate;
}
@keyframes cat-tail-3 {
  to {
    transform: translate(0px, 6.5px);
  }
}
.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(8) {
  animation: cat-tail-7 0.4s ease-in-out 0.224s infinite alternate;
}
@keyframes cat-tail-7 {
  to {
    transform: translate(0.7px, 6.8px);
  }
}

.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(5) {
  animation: cat-tail-4 0.4s ease-in-out 0.18s infinite alternate;
}
@keyframes cat-tail-4 {
  to {
    width: 1.5px;
    height: 1.3px;
    transform: translate(-0.4px, 7px);
  }
}
.animation-rainbow-cat .rainbow-cat .cat .cat-tail rect:nth-of-type(9) {
  animation: cat-tail-8 0.4s ease-in-out 0.2s infinite alternate;
}
@keyframes cat-tail-8 {
  to {
    transform: translate(0.2px, 7.2px);
  }
}
</style>
