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
        <strong>Allspin</strong>: allspins / pieces used to in line clears (not including t, i, or o
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
        <strong>Spike</strong>: you were spiked sortly before you died.<br>
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
import { type ClearType, type CumulativeStats, type DeathTypes } from "@/replay/types/stats";
import { createStackedBar, type StackedDataPoint } from "@/graphs/stackedBar";
import { createSpeed } from "@/graphs/speed";
import { createWellCols } from "@/graphs/wellCols";
import { createSankey } from "@/graphs/sankey";
import { createRadar, type radarAxis } from "@/graphs/radar";
import { createOverflowStackedBar } from "@/graphs/overflowStackedBar";
import { createMultiWellCols } from "@/graphs/multiWellCols";
import { createMultiPPS } from "@/graphs/ppsSegments";

import { defaultRainbow } from "@/theme/colors";

import * as d3 from "d3"

import { type GraphType } from "@/graphs/types";

import { onMounted, ref, watch } from "vue";
import { SVGToPng } from "@/graphs/util";

const aboutActive = ref(false)

const d3RootDiv = ref<HTMLElement | undefined>()

const props = defineProps<{
  data: { [key: string]: CumulativeStats },
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
  createGraph(props.type, props.data)
}

watch(props, () => {
  reRender()
})

onMounted(() => {
  reRender()
})



function createGraph(graphType: GraphType, stats: { [key: string]: CumulativeStats }) {
  if (d3RootDiv.value == undefined) throw Error()
  const rootDiv = d3RootDiv.value

  if (graphType == "kills") {
    const keys: DeathTypes[] =
      [
        "Surge Conflict",
        "Surge Spike",
        "Cheese Spike",
        "Spike",
        "Cheese Pressure",
        "Pressure"
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.green,
        defaultRainbow.teal,
        defaultRainbow.violet,
        defaultRainbow.purple,
        defaultRainbow.pink,
        defaultRainbow.blue,
      ]
    colors.reverse()

    const shortName = (k: DeathTypes) => {
      if (k == "Surge Spike") {
        return "Surge"
      } else if (k == "Cheese Pressure") {
        return "Cheese"
      }
      return k
    }

    type ClearMap = { [key in DeathTypes]: number }

    const data: StackedDataPoint<ClearMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: stats[key].killStats
      })
    }
    createStackedBar<ClearMap>(rootDiv, "Kills", data, keys, colors, shortName)
  }

  else if (graphType == "deaths") {
    const keys: DeathTypes[] =
      [
        "Surge Conflict",
        "Surge Spike",
        "Cheese Spike",
        "Spike",
        "Cheese Pressure",
        "Pressure"
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.green,
        defaultRainbow.teal,
        defaultRainbow.violet,
        defaultRainbow.purple,
        defaultRainbow.pink,
        defaultRainbow.blue,
      ]
    colors.reverse()

    const shortName = (k: DeathTypes) => {
      if (k == "Surge Spike") {
        return "Surge"
      } else if (k == "Cheese Pressure") {
        return "Cheese"
      }
      return k
    }

    type ClearMap = { [key in DeathTypes]: number }

    const data: StackedDataPoint<ClearMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: stats[key].deathStats
      })
    }
    createStackedBar<ClearMap>(rootDiv, "Deaths", data, keys, colors, shortName)
  }

  else if (graphType == "clear types") {
    const keys: ClearType[] =
      [
        "perfectClear",
        "allspin",
        "tspinTriple",
        "tspinDouble",
        "tspinSingle",
        "quad",
        "triple",
        "double",
        "single",
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.green,
        defaultRainbow.teal,
        defaultRainbow.violet,
        defaultRainbow.purple,
        defaultRainbow.pink,
        defaultRainbow.blue,
        defaultRainbow.orange,
        defaultRainbow.yellow,
        defaultRainbow.red,
      ]
    colors.reverse()

    const shortName = (k: ClearType) => {
      switch (k) {
        case "perfectClear": return "pc"
        case "tspinTriple": return "tst"
        case "tspinDouble": return "tsd"
        case "tspinSingle": return "tss"
        default: return k as string
      }
    }

    type ClearMap = { [key in ClearType]: number }

    const data: StackedDataPoint<ClearMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: stats[key].clearTypes
      })
    }
    createStackedBar<ClearMap>(rootDiv, "Lineclear Distribution", data, keys, colors, shortName)
  }

  else if (graphType == "PPS distribution") {
    const data: number[][] = []
    const names = []
    for (const key in stats) {
      data.push(stats[key].ppsSegments)
      names.push(key)
    }

    createMultiPPS(rootDiv, "Placement PPS", names, data.map(x => {
      const y = new Array(50).fill(0)
      for (let i = 0; i < x.length; i++) {
        y[Math.floor(i / 2)] += x[i] * 100
      }
      return y
    }))
  }

  else if (graphType == "well columns") {
    const data: number[][] = []
    const names = []
    for (const key in stats) {
      data.push(stats[key].wellColumns)
      names.push(key)
    }
    if (data.length > 1) {
      createMultiWellCols(rootDiv, "Well Columns", names, data.map(x => {
        let sum = 0
        for (const v of x) { sum += v }
        for (let i = 0; i < x.length; i++) {
          x[i] = x[i] / sum * 100
        }
        return x
      }))
    } else {
      createWellCols(rootDiv, "Well Columns", names[0], data[0])
    }
  }

  else if (graphType == "spin efficiency") {
    type StatMap = {
      allspinEfficiency: number
      tEfficiency: number
      iEfficiency: number
    }
    const keys: (Extract<keyof StatMap, string>)[] =
      [
        "allspinEfficiency",
        "tEfficiency",
        "iEfficiency",
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.green,
        defaultRainbow.purple,
        defaultRainbow.blue,
      ]
    colors.reverse()

    const shortName = (k: Extract<keyof StatMap, string>) => {
      switch (k) {
        case "allspinEfficiency": return "allspinEff"
        case "tEfficiency": return "tspinEff"
        case "iEfficiency": return "quadEff"
        default: return k as string
      }
    }


    const data: StackedDataPoint<StatMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: {
          allspinEfficiency: (Math.round(stats[key].allspinEfficiency * 100)),
          tEfficiency: (Math.round(stats[key].tEfficiency * 100)),
          iEfficiency: (Math.round(stats[key].iEfficiency * 100)),
        }
      })
    }
    createOverflowStackedBar<StatMap>(rootDiv, "", data, 90, keys, colors, shortName, 30)
  }

  else if (graphType == "attack per line") {
    type StatMap = {
      cheeseAPL: number
      downstackAPL: number
      upstackAPL: number
    }
    const keys: (Extract<keyof StatMap, string>)[] =
      [
        "cheeseAPL",
        "downstackAPL",
        "upstackAPL",
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.yellow,
        defaultRainbow.red,
        defaultRainbow.green,
      ]
    colors.reverse()

    const shortName = (k: Extract<keyof StatMap, string>) => {
      switch (k) {
        case "cheeseAPL": return "cheese APL"
        case "downstackAPL": return "downstack APL"
        case "upstackAPL": return "upstack APL"
        default: return k as string
      }
    }


    const data: StackedDataPoint<StatMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: {
          cheeseAPL: (Math.round(stats[key].cheeseAPL * 100) / 100),
          downstackAPL: (Math.round(stats[key].downstackAPL * 100) / 100),
          upstackAPL: (Math.round(stats[key].upstackAPL * 100) / 100),
        }
      })
    }
    createOverflowStackedBar<StatMap>(rootDiv, "", data, 1.2 * 3, keys, colors, shortName, 0.5)
  }

  else if (graphType == "phase PPS") {
    type StatMap = {
      openerPPS: number
      PPS: number
      midgamePPS: number
    }
    const keys: (Extract<keyof StatMap, string>)[] =
      [
        "openerPPS",
        "PPS",
        "midgamePPS",
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.yellow,
        defaultRainbow.red,
        defaultRainbow.green,
      ]
    colors.reverse()

    const shortName = (k: Extract<keyof StatMap, string>) => {
      switch (k) {
        case "openerPPS": return "opener"
        case "PPS": return "overall"
        case "midgamePPS": return "midgame"
        default: return k as string
      }
    }


    const data: StackedDataPoint<StatMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: {
          openerPPS: (Math.round(stats[key].openerPPS * 100) / 100),
          PPS: (Math.round(stats[key].PPS * 100) / 100),
          midgamePPS: (Math.round(stats[key].midgamePPS * 100) / 100),
        }
      })
    }
    createOverflowStackedBar<StatMap>(rootDiv, "PPS", data, 2.5 * 3, keys, colors, shortName, 0.9)
  }


  else if (graphType == "phase APM") {
    type StatMap = {
      openerAPM: number
      APM: number
      midgameAPM: number
    }
    const keys: (Extract<keyof StatMap, string>)[] =
      [
        "openerAPM",
        "APM",
        "midgameAPM",
      ]
    keys.reverse()
    const colors: string[] =
      [
        defaultRainbow.yellow,
        defaultRainbow.red,
        defaultRainbow.green,
      ]
    colors.reverse()

    const shortName = (k: Extract<keyof StatMap, string>) => {
      switch (k) {
        case "openerAPM": return "opener"
        case "APM": return "overall"
        case "midgameAPM": return "midgame"
        default: return k as string
      }
    }


    const data: StackedDataPoint<StatMap>[] = []
    for (const key in stats) {
      data.push({
        category: key,
        stat: {
          openerAPM: (Math.round(stats[key].openerAPM)),
          APM: (Math.round(stats[key].APM)),
          midgameAPM: (Math.round(stats[key].midgameAPM)),
        }
      })
    }
    createOverflowStackedBar<StatMap>(rootDiv, "APM", data, 300, keys, colors, shortName, 37.5)
  }


  else if (graphType == "attack recieved") {
    type NodeName = "IncomingAttacks" | "Cheese" | "Clean" | "Cancelled" | "CheeseTanked" | "CleanTanked"
    const indexedNodeNames: NodeName[] = ["IncomingAttacks", "Clean", "Cheese", "CleanTanked", "CheeseTanked", "Cancelled"]

    function color(nodeName: NodeName, targetNodeName: NodeName) {
      if (targetNodeName == "CleanTanked") {
        return defaultRainbow.green
      }
      else if (targetNodeName == "CheeseTanked") {
        return defaultRainbow.red
      }
      else if (targetNodeName == "Cancelled") {
        if (nodeName == "Cheese") {
          return defaultRainbow.teal
        } else {
          return defaultRainbow.yellow
        }
      }
      if (targetNodeName == "Cheese") {
        return defaultRainbow.purple
      }
      else if (targetNodeName == "Clean") {
        return defaultRainbow.pink
      }
      return defaultRainbow.teal
    }

    const data: { name: string; links: { source: number; target: number; value: number; }[]; }[] = []

    for (const key in stats) {
      if (!(stats[key].cheeseLinesRecieved + stats[key].cleanLinesRecieved > 0)) continue
      const s = stats[key]
      data.push({
        name: key,
        links: [
          {
            source: 0, target: 2,
            value: (Math.round(s.cheeseLinesRecieved * 100))
          },
          {
            source: 0, target: 1,
            value: (Math.round(s.cleanLinesRecieved * 100))
          },
          {
            source: 2, target: 5,
            value: (Math.round(s.cheeseLinesCancelled * 100))
          },
          {
            source: 2, target: 4,
            value: (Math.round(s.cheeseLinesTanked * 100))
          },
          {
            source: 1, target: 5,
            value: (Math.round(s.cleanLinesCancelled * 100))
          },
          {
            source: 1, target: 4,
            value: (Math.round(s.cleanLinesTankedAsCheese * 100))
          },
          {
            source: 1, target: 3,
            value: (Math.round(s.cleanLinesTankedAsClean * 100))
          },
        ]
      })
    }
    createSankey<NodeName>(rootDiv, data, indexedNodeNames, color)
  }


  else if (graphType == "downstacking") {
    const labels = [
      {
        label: "upstacker",
        color: defaultRainbow.teal
      },
      {
        label: "aggressive",
        color: defaultRainbow.green
      },
      {
        label: "medium",
        color: defaultRainbow.yellow
      },
      {
        label: "defensive",
        color: defaultRainbow.orange
      },
      {
        label: "downstacker",
        color: defaultRainbow.red
      }
    ]

    const data: number[] = []
    const names = []
    for (const key in stats) {
      if (!Number.isFinite(stats[key].downstackingRatio)) continue
      data.push(Math.round(stats[key].downstackingRatio * 100))
      names.push(key)
    }

    createSpeed(rootDiv, "Downstacking Ratio", data, names, 100, [0, 20, 40, 60, 80, 100], labels)
  }

  else if (graphType == "attack cheesiness") {
    const labels = [
      {
        label: "lean",
        color: defaultRainbow.teal
      },
      {
        label: "clean",
        color: defaultRainbow.green
      },
      {
        label: "medium",
        color: defaultRainbow.yellow
      },
      {
        label: "cheesy",
        color: defaultRainbow.orange
      },
      {
        label: "greasy",
        color: defaultRainbow.red
      }
    ]

    const data: number[] = []
    const names = []
    for (const key in stats) {
      if (!Number.isFinite(stats[key].downstackingRatio)) continue
      data.push(Math.round(stats[key].attackCheesiness * 100))
      names.push(key)
    }

    createSpeed(rootDiv, "Attack Cheesiness", data, names, 100, [0, 20, 40, 60, 80, 100], labels)
  }


  else if (graphType == "surge") {

    const userData: number[][] = []
    const usernames: string[] = []

    for (const key in stats) {
      const ll = [
        (stats[key].surgeAPM),
        (stats[key].surgePPS),
        (stats[key].surgeLength),
        (stats[key].surgeRate * 100),
        (stats[key].surgeSecsPerDS),
        (stats[key].surgeSecsPerCheese)
      ]

      let ok = true
      for (const v of ll) {
        if (Number.isNaN(v)) {
          ok = false
          break
        }
      }

      if (ok) {
        usernames.push(key)
        userData.push(ll)
      }
    }

    const axis: radarAxis[] = [
      {
        label: "APM",
        scale: d3.scaleLinear([0, Math.max(300, (Math.max(...userData.map(x => x[0]))))], [0, 1]).clamp(true)
      },
      {
        label: "PPS",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[1]))))], [0, 1]).clamp(true)
      },
      {
        label: "Length",
        scale: d3.scaleLinear([0, Math.max(10, (Math.max(...userData.map(x => x[2]))))], [0, 1]).clamp(true)
      },
      {
        label: "Conversion Rate",
        scale: d3.scaleLinear([0, Math.max(15, (Math.max(...userData.map(x => x[3]))))], [0, 1]).clamp(true)
      },
      {
        label: "Sec/DS",
        scale: d3.scaleSqrt([Math.max(20, (Math.max(...userData.map(x => x[4])))), 0], [0, 1]).clamp(true)
      },
      {
        label: "Sec/Cheese",
        scale: d3.scaleSqrt([Math.max(40, (Math.max(...userData.map(x => x[5])))), 0], [0, 1]).clamp(true)
      },
    ]
    createRadar(rootDiv, "Surge", axis, userData, usernames)
  }

  else if (graphType == "PPS") {

    const userData: number[][] = []
    const usernames: string[] = []

    for (const key in stats) {
      const ll = [
        (stats[key].PPS),
        (stats[key].PlonkPPS),
        (stats[key].upstackPPS),
        (stats[key].PPSCoeff),
        (stats[key].downstackPPS),
        (stats[key].BurstPPS),
      ]

      let ok = true
      for (const v of ll) {
        if (Number.isNaN(v)) {
          ok = false
          break
        }
      }

      if (ok) {
        usernames.push(key)
        userData.push(ll)
      }
    }

    const axis: radarAxis[] = [
      {
        label: "PPS",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[0]))))], [0, 1]).clamp(true)
      },
      {
        label: "Plonk PPS",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[1]))))], [0, 1]).clamp(true)
      },
      {
        label: "Upstack PPS",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[2]))))], [0, 1]).clamp(true)
      },
      {
        label: "PPS Variance",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[3]))))], [0, 1]).clamp(true)
      },
      {
        label: "Downstack PPS",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[4]))))], [0, 1]).clamp(true)
      },
      {
        label: "Burst PPS",
        scale: d3.scaleLinear([0, Math.max(5, (Math.max(...userData.map(x => x[5]))))], [0, 1]).clamp(true)
      },
    ]
    createRadar(rootDiv, "PPS", axis, userData, usernames)
  }
}

</script>
