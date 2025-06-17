import { shallowRef, triggerRef } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { PlayerGameStats } from 'minomuncher-core'
import { usePriorityTokenStore } from './priorityToken'

export type FileStatFetch = { fileHash: string, res: PlayerGameStats | 'pending' | 'failed' }
export type ReplayStatFetch = { playerName: string, replayId: string, res: PlayerGameStats | 'pending' | 'failed' }
export type StatFetch = FileStatFetch | ReplayStatFetch

export const useStatStore = defineStore('statFetches', () => {
  const { priorityToken } = storeToRefs(usePriorityTokenStore())
  const statFetches = shallowRef<StatFetch[]>([])
  function popQueries() {
    if (statFetches.value.length > 200) {
      statFetches.value.shift() //look, maybe there arent queries resolved, but like there shouldnt be so im not going to do async jank
    }
  }

  function fileStatus(fileHash: string) {
    for (const x of statFetches.value) {
      if ('fileHash' in x && fileHash === x.fileHash) {
        return x.res
      }
    }
    return 'unloaded'
  }

  function replayStatus(replayId: string) {
    for (const x of statFetches.value) {
      if ('replayId' in x && replayId === x.replayId) {
        return x.res
      }
    }
    return 'unloaded'
  }

  function newReplay(playerName: string, replayId: string, override: boolean = false) {
    for (const [index, x] of statFetches.value.entries()) {
      if ('replayId' in x && replayId === x.replayId) {
        if (override) {
          statFetches.value.splice(index, 1)
        } else {
          return x.res

        }
      }
    }
    const resp: ReplayStatFetch = {
      playerName,
      replayId,
      res: 'pending'
    }
    fetch(`/api/replay/${replayId}`, {
      headers: {
        supporter: priorityToken.value
      }
    }).then(x => x.json()).then(x => {
      if (Object.keys(x).length == 0) {
        throw Error("no data from replay")
      }
      for (const key in x.stats) {
        if (!('death' in x.stats[key])) {
          throw Error("invalid replay")
        }
      }
      resp.res = x
      triggerRef(statFetches)
    }).catch(e => {
      console.error(e)
      triggerRef(statFetches)
      resp.res = 'failed'
    })
    statFetches.value.push(resp)
    popQueries()
    triggerRef(statFetches)
    return 'pending'
  }
  function newFile(fileHash: string, data: string, override: boolean = false) {
    for (const [index, x] of statFetches.value.entries()) {
      if ('fileHash' in x && fileHash === x.fileHash && x.res) {
        if (override) {
          statFetches.value.splice(index, 1)

        } else {
          return x.res
        }
      }
    }
    const resp: FileStatFetch = {
      fileHash: fileHash,
      res: 'pending',
    }
    fetch("/api/replay", {
      method: "POST",
      body: data,
      headers: {
        supporter: priorityToken.value
      }
    }).then(x => x.json()).then(x => {
      if (Object.keys(x).length == 0) {
        throw Error("no data from replay")
      }
      for (const key in x.stats) {
        if (!('death' in x.stats[key])) {
          throw Error("invalid replay")
        }
      }
      resp.res = x
      triggerRef(statFetches)
    }).catch(e => {
      console.error(e)
      triggerRef(statFetches)
      resp.res = 'failed'
    })
    statFetches.value.push(resp)
    popQueries()
    triggerRef(statFetches)
    return 'pending'
  }

  function reset() {
    statFetches.value = []
    triggerRef(statFetches)
  }

  return { statFetches, newReplay, newFile, fileStatus, replayStatus, reset }

}, {
  persist: true
})
