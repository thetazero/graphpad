import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    nodeById: () => async id => await get(id),
    edgesById: () => async id => await get(`edges/${id}`),
    getNodes: () => async () => await get(''),
    getNodesQuery: () => async query => await get(`q/${encodeURIComponent(query)}`),
    getTypedNodesQuery: () => async ({ query, type }) => {
      if (query) return await get(`${type}/q/${encodeURIComponent(query)}`)
      else return await get(`${type}/q/`)
    },
    getPossibleEdges: () => from => {
      return edgeTypes.filter(e => {
        return from == e.from || from == e.to
      })
    }
  },
  mutations: {
  },
  actions: {
    async createNode(_, { type, name }) {
      return await simplePost(`create/${type}/${encodeURIComponent(name)}`)
    },
    async updateNode(_, data) {
      return await post(`update/${data.id}`, data.data)
    },
    async linkNodes(_, { from, to, type }) {
      return await post(`link/${type}/${from}/${to}`)
    }
  },
  modules: {
  }
})

let api = 'http://192.168.86.94:3000/api/'
async function get(query) {
  let res = await window.fetch(api + query)
  let data = await res.json()
  return data
}

async function simplePost(query) {
  let res = await window.fetch(api + query, { method: 'post' })
  let data = await res.json()
  // console.log(`data: ${data}`)
  return data
}

async function post(query, payload) {
  let res = await window.fetch(api + query,
    {
      method: 'post', body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    }
  )
  return await res.json()
}

const edgeTypes = [
  {
    from: 'Person',
    to: 'Person',
    name: 'Knows',
    revname: 'Knows'
  },
  {
    from: 'Person',
    to: 'Date',
    name: 'Born',
    revname: 'Person who was born on this date'
  }
]