<template>
  <div>
    <div v-show="aboutActive" id="aboutStat">
      <p v-if="type == 'PPS'">
        <strong>PPS</strong>: pieces placed per second.<br>
        <strong>Plonk and Burst PPS</strong>: the lowest and largest centers on the <em>PPS Distribution</em>.
        Calculated using k-means.<br>
        <strong>Upstack PPS</strong>: upstack is defined as any segment where no lines are cleared that includes more
        than 7 blocks.<br>
        <strong>Downstack PPS</strong>: downstack segments start when you clear a column of garbage. They end when no
        new column of garbage has been cleared recently.<br>
        <strong>PPS Variance</strong>: <a href="https://en.wikipedia.org/wiki/Variance">Standard Variance</a> based on
        the <em>PPS Histogram.</em>
      </p>
      <p v-else-if="type == 'surge'">
        <strong>APM and PPS</strong>: attack per minute (included unused surge) and pieces per second when surge is
        active.<br>
        <strong>Length</strong>: average length of a surge chain.<br>
        <strong>Conversion rate</strong>: percentage of b2b clears that become part of a surge (not including b2b
        clears.
        once surge is active).<br>
        <strong>Sec/DS and Sec/Cheese</strong>: seconds it takes to downstack garbage and cheese when surge is active.
      </p>
      <p v-else-if="type == 'attack cheesiness'">
        0-100 value that measures how cheesy lines <em>sent</em> are<br>
        The heuristic is based on the cheese race bot <em>blockfish's</em> estimations on the pieces required to
        downstack garbage.
      </p>
      <p v-else-if="type == 'downstacking'">
        <strong>Upstack</strong> is defined as any segment where no lines are cleared that includes more
        than 7 blocks<br>
        <strong>Downstack </strong> segments start when you clear a column of garbage. They end when no
        new column of garbage has been cleared recently.<br>
        This statistic measures the ratio <em>downstacking</em> to <em>downstacking and upstacking</em> as a percentage.
      </p>
      <p v-else-if="type == 'attack recieved'">
        All stats shown are percentage and are measured by lines. Incoming Attacks start at 100%, then are split into
        Clean and Cheese. <strong>Clean attacks</strong> are any attacks with a line count greater than or equal to
        4.<br>
        Attacks are either <strong>tanked</strong> (accepted onto the board) or <strong>cancelled</strong>.<br>
        Note that <strong>clean</strong> attacks can be tanked as <strong>cheese</strong> if they are partially
        cancelled then
        accepted.<br>
        Also note that cheese attacks can never be tanked as clean.
      </p>
      <p v-else-if="type == 'phase PPS' || type == 'phase APM'">
        the <strong>opener</strong> phase in minomuncher starts when each game starts. <br>
        The opener phase <em>begins to end</em> when the first line of garbage is cleared, but it continues until the
        current combo is over.<br>
        Then, the <strong>midgame</strong> phase starts.<br>
        <strong>Overall</strong> is the same as baseline stats.<br>
        <em v-if="type == 'phase APM'">All APM includes unused surge at the end of a game.</em>
      </p>
      <p v-else-if="type == 'attack per line'">
        <strong>APL</strong>: attack per line.<br>
        <strong>Upstack</strong>: attacks that only clear non-garbage lines.<br>
        <strong>Downstack</strong>: attacks that clear garbage lines.<br>
        <strong>Cheese</strong>: attacks that clear cheese garbage (garbage under 4 height).<br>
        Note that if you clear a tetris that does 4 lines while clearing 1 line of garbage and 3 lines of stack, then
        the Cheese and Downstack APL is 4.
      </p>
      <p v-else-if="type == 'spin efficiency'">
        All stats are percentages <br>
        <strong>Quad</strong>: tetris / i pieces<br>
        <strong>Tspin</strong>: tspins / t pieces<br>
        <strong>Allspin</strong>: allspins / pieces used to be used in line clears (not including t, i, or o
        pieces)
      </p>
      <p v-else-if="type == 'well columns'">
        Histogram showing distribution of well columns.<br>
        A <strong>well column</strong> is defined by a user made stack (not all garbage) that is able to be tetris
        cleared.
      </p>
      <p v-else-if="type == 'PPS distribution'">
        Histogram (each bucket is 0.1 pps) that represents each placement's Piece Per Second rate during
        <em>midgame</em>
      </p>
      <p v-else-if="type == 'clear types'">
        Stacked Bar chart that represents each line clear.<br>
        Notes: <strong>PC</strong> overrides everything. <strong>TSMS</strong> are counted as <strong>allspins</strong>.
      </p>
      <p v-else-if="type == 'deaths' || type == 'kills'">
        <strong>Surge Conflict</strong>: you and your opponent both activated surge spikes shortly before game end.<br>
        <strong>Surge</strong>: your opponent activated surge shortly before you died.<br>
        <strong>Cheese Spike</strong>: you had cheese on your board and were spike shortly before you died.<br>
        <strong>Spike</strong>: you were spiked shortly before you died.<br>
        <strong>Cheese</strong>: you had cheese on your board shortly before you died.<br>
        <strong>Pressure</strong>: none of the above apply.
      </p>
      <p v-if="type == 'phase APM' || type == 'phase PPS' || type == 'attack per line' || type == 'spin efficiency'">
        Overflow values are when you exceed the cutoff (around average U rank) of combined stats.<br>
        Stars and ranks are assigned by how much you overflow the cutoff. There is no cap on the amount of stars you can
        get.<br>
        The ranks in order are
        <strong :style="{ color: defaultRainbow.green }">uncommon, </strong>
        <strong :style="{ color: defaultRainbow.violet }">rare, </strong>
        <strong :style="{ color: defaultRainbow.purple }">epic, </strong>
        <strong :style="{ color: defaultRainbow.blue }">legendary, </strong>
        <strong :style="{ color: defaultRainbow.pink }">mythic, </strong>
        <strong :style="{ color: defaultRainbow.yellow }">exotic, </strong>
        <strong :style="{ color: defaultRainbow.orange }">ancient, </strong>
        <strong :style="{ color: defaultRainbow.red }">divine, </strong>
      </p>
    </div>
    <div v-show="!aboutActive" id="d3RootDiv" ref="d3RootDiv"></div>
    <button v-if="!aboutActive" @click="SVGToPng(d3RootDiv!, type)">download</button>
    <button v-text="!aboutActive ? 'about this graph' : 'visualize'" @click="aboutActive = !aboutActive"
      style="border-left: 2px solid var(--f_low);"></button>
  </div>
</template>
<style scoped lang="css">
#d3RootDiv {
  font-family: "Martel", serif;
  font-weight: 700;
  font-style: normal;
  width: 800px;
  font-size: 10px;
}

#aboutStat p strong {
  color: var(--f_med)
}

#aboutStat p a {
  color: var(--f_high);
}

#aboutStat {
  overflow-y: auto;
  font-family: "Martel", serif;
  font-weight: 700;
  font-style: normal;
  font-size: 24px;
  width: 600px;
  max-height: 760px;
  color: var(--f_low)
}

button {
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  color: var(--f_low);
}

button:hover {
  color: var(--f_high);
}

button:active {
  color: var(--f_med);
}
</style>

<script setup lang="ts">
import { defaultRainbow } from "@/theme/colors";

import * as d3 from "d3"
import { createGraph, type GraphType, type PlayerCumulativeStats } from "minomuncher-core";

import { onMounted, ref, watch } from "vue";

const aboutActive = ref(false)

const d3RootDiv = ref<HTMLElement | undefined>()

const props = defineProps<{
  data: PlayerCumulativeStats,
  type: GraphType,
}>()

function removeAllChildNodes(parent: HTMLElement) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function reRender() {
  if (d3RootDiv.value === undefined) throw Error()
  removeAllChildNodes(d3RootDiv.value)
  createGraph(d3RootDiv.value, props.type, props.data)
}

function SVGToPng(input: HTMLElement, title: string) {
  let width = "600"
  let height = "600"

  if (input.firstChild && (input.firstChild as SVGAElement).getAttribute("height")! && (input.firstChild as SVGAElement).getAttribute("width")!) {
    height = String(Number.parseInt((input.firstChild as SVGAElement).getAttribute("height")!) * 2)
    width = String(Number.parseInt((input.firstChild as SVGAElement).getAttribute("height")!) * 2)
  } else {
    return
  }

  const svgData = new XMLSerializer().serializeToString(input.firstChild!)
  const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
  const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

  const image = new Image()

  image.addEventListener('load', () => {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('width', String(width))
    canvas.setAttribute('height', String(height))

    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0, Number.parseFloat(width), Number.parseFloat(height))

    const dataUrl = canvas.toDataURL('image/png')
    const aDownloadLink = document.createElement('a');
    aDownloadLink.download = `${title}.png`;
    aDownloadLink.href = dataUrl;
    aDownloadLink.click();

    aDownloadLink.remove()
    canvas.remove()
  })

  image.src = svgDataUrl
}


watch(props, () => {
  reRender()
})

onMounted(() => {
  reRender()
})
</script>
