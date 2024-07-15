import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loaded: false,
  loading: false,
  error: null,
  files: [],
  path: 'C:/Users/ducdoa/Project/blog/'
}
const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    getFiles: (state, action) => {
      state.loading = false
      state.loaded = true
      state.files = action.payload
    },
    setPath: (state, action) => {
      state.path = action.payload
    }
  }
})
export default fileSlice
