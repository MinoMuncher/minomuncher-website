import { shallowRef, triggerRef } from 'vue'
import { defineStore } from 'pinia'
import type { GameStats } from '@/replay/types/stats'

export type FileStatFetch = { fileHash: string, res: { [key: string]: GameStats } | 'pending' | 'failed' }
export type ReplayStatFetch = { playerName: string, replayId: string, res: { [key: string]: GameStats } | 'pending' | 'failed' }
export type StatFetch = FileStatFetch | ReplayStatFetch

export const useStatStore = defineStore('statFetches', () => {
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

  function newReplay(playerName: string, replayId: string) {
    for (const x of statFetches.value) {
      if ('replayId' in x && replayId === x.replayId) {
        return x.res
      }
    }
    const resp: ReplayStatFetch = {
      playerName,
      replayId,
      res: 'pending'
    }
    fetch(`/api/replay/${replayId}`).then(x => x.json()).then(x => {
      if (Object.keys(x).length == 0) {
        throw Error("no data from replay")
      }
      for (const key in x) {
        if (!('death' in x[key])) {
          throw Error("invalid replay")
        }
      }
      resp.res = x
      triggerRef(statFetches)
      console.log("finished!")
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
  function newFile(fileHash: string, data: string) {
    for (const x of statFetches.value) {
      if ('fileHash' in x && fileHash === x.fileHash) {
        return x.res
      }
    }
    const resp: FileStatFetch = {
      fileHash: fileHash,
      res: 'pending',
    }
    fetch("/api/replay", {
      method: "POST",
      body: data,
    }).then(x => x.json()).then(x => {
      if (Object.keys(x).length == 0) {
        throw Error("no data from replay")
      }
      for (const key in x) {
        if (!('death' in x[key])) {
          throw Error("invalid replay")
        }
      }
      console.log(x)
      resp.res = x
      triggerRef(statFetches)
      console.log("finished!")
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

  return { statFetches, newReplay, newFile, fileStatus, replayStatus }

}, {
  persist: true
})
