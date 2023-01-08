import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { apiLoadTopics, apiLoadTopicsByIdCourse, apiLoadTopicsByParentId, apiUpdateTopic} from '../../api/topicApi'
import { Topic } from '../../submodule/models/topic'

// Define a type for the slice state
interface TopicDatailState {
  topicDetails: Topic[],
  loading: boolean,
  error: string,
  topicInfo: Topic | null
}

// Define the initial state using that type
const initialState: TopicDatailState = {
  topicDetails: [],
  loading: false,
  error: '',
  topicInfo: null
}

export const requestLoadTopicsByParentId = createAsyncThunk('topic/loadTopicsByParentId', async (props: {
  parentId: string
}) => {
  const res = await apiLoadTopicsByParentId(props);
  return res.data
})

export const topicDetailSlice = createSlice({
  name: 'topicDetails',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    const actionList = [requestLoadTopicsByParentId];
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

     // load parentId
     builder.addCase(requestLoadTopicsByParentId.fulfilled, (state, action: PayloadAction<{
      data: Topic[],
      status: number
    }>) => {
      state.loading = false;
      state.topicDetails = action.payload.data.map((o) => new Topic(o));
    })
  }
})

export const { } = topicDetailSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const topicDatailState = (state: RootState) => state.topicDetail

export default topicDetailSlice.reducer