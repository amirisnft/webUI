import { defineStore } from "pinia"

export const useNftStore = defineStore('nft', {
  state: () => ({ nfts:[] as any, selectedNfts: [] as any }),
  getters: {
    getNftData:(state) => state.nfts,
    getSelectedNftData:(state) => state.selectedNfts
  },
  actions: {
    async actionGetNftData() {
      let data = {
        method:"GET"
      }

      for(let i = 0; i < 420; i++) {

        let response = await fetch("https://ipfs.io/ipfs/QmXsSBr4YSysQaFKWigNyfjAaPJmDxdaC5hpEmFCVQXKai/"+i+".json", data)
        let mainData = await response.json()
        this.nfts.push(mainData)
      }
    },

    async actionGetIndividualNftData(edition: any) {
      let data = {
        method:"GET"
      }
      try {
        let response = await fetch("https://ipfs.io/ipfs/QmXsSBr4YSysQaFKWigNyfjAaPJmDxdaC5hpEmFCVQXKai/"+edition+".json", data)
        let mainData = await response.json()
        return mainData
      } catch(err) {
        console.log(err)
      }
    },

    async actionAddNftSelected(item: any) {
      this.selectedNfts.push(item)
    },
    async actionRemoveNftSelected(item: any) {
      let index = this.getSelectedNftData.indexOf(item)
      if (index > -1) {
        this.selectedNfts.splice(index, 1)
      }
    }
  },
})