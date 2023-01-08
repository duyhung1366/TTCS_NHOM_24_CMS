import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { Tag as Tags  } from '../../submodule/models/tag'
import { apiLoadTags, apiLoadTagsByIdCategory, apiUpdateTag } from '../../api/tagApi'

// Define a type for the slice state
interface TagState {
  tags: Tags[],
  loading: boolean,
  error: string,
  tagInfo: Tags | null
}

// Define the initial state using that type
const initialState: TagState = {
  tags: [],
  loading: false,
  error: '',
  tagInfo: null
}

export const requestLoadTags = createAsyncThunk('tag/loadTags', async (props: { status: number }) => {
  const res = await apiLoadTags(props);
  return res.data
})


export const requestLoadTagsByIdCategory = createAsyncThunk('tag/loadTagsByIdCategory', async (props: {idCategory:string[], status: number }) => {
  const res = await apiLoadTagsByIdCategory(props);
  return res.data
})

export const requestUpdateTag = createAsyncThunk('tag/updateTag', async (props: Tags) => {
  const res = await apiUpdateTag(props);
  return res.data
})

export const tagSlice = createSlice({
  name: 'tag',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    const actionList = [requestLoadTags, requestUpdateTag, requestLoadTagsByIdCategory];
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })
    actionList.forEach(action => {
      builder.addCase(action.rejected, (state) => {
        state.loading = false;
      })
    })

    // load 
    builder.addCase(requestLoadTags.fulfilled, (state, action: PayloadAction<{
      data: Tags[],
      status: number
    }>) => {
      state.loading = false;
      state.tags = action.payload.data.map((o) => new Tags(o));
    })

     // load tag by id category
     builder.addCase(requestLoadTagsByIdCategory.fulfilled, (state, action: PayloadAction<{
      data: Tags[],
      status: number
    }>) => {
      state.loading = false;
      state.tags = action.payload.data.map((o) => new Tags(o));
    })

    // update
    builder.addCase(requestUpdateTag.fulfilled, (state, action: PayloadAction<{
      data: Tags,
      status: number
    }>) => {
      state.loading = false;
      state.tagInfo = new Tags(action.payload.data)
    })
  }
})

export const { } = tagSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const tagState = (state: RootState) => state.tag

export default tagSlice.reducer