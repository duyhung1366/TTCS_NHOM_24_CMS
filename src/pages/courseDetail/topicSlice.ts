import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { apiLoadTopics, apiLoadTopicsByIdCourse, apiLoadTopicsByParentId, apiUpdateTopic} from '../../api/topicApi'
import { Topic } from '../../submodule/models/topic'

// Define a type for the slice state
interface TopicState {
  topics: Topic[],
  loading: boolean,
  error: string,
  topicInfo: Topic | null
}

// Define the initial state using that type
const initialState: TopicState = {
  topics: [],
  loading: false,
  error: '',
  topicInfo: null
}

export const requestLoadTopics = createAsyncThunk('topic/loadTopics', async (props: { status: number }) => {
  const res = await apiLoadTopics(props);
  return res.data
})

export const requestUpdateTopics = createAsyncThunk('topic/updateTopics', async (props: Topic) => {
  const res = await apiUpdateTopic(props);
  return res.data
})

export const requestLoadTopicsByIdCourse = createAsyncThunk('topic/loadTopicsByIdCourse', async (props: {
  type: number,
  idCourse: string
}) => {
  const res = await apiLoadTopicsByIdCourse(props);
  return res.data
})

export const requestLoadTopicsByParentId = createAsyncThunk('topic/loadTopicsByParentId', async (props: {
  parentId: string
}) => {
  const res = await apiLoadTopicsByParentId(props);
  return res.data
})

export const topicSlice = createSlice({
  name: 'topic',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    const actionList = [requestLoadTopics, requestUpdateTopics, requestLoadTopicsByIdCourse, requestLoadTopicsByParentId];
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
    builder.addCase(requestLoadTopics.fulfilled, (state, action: PayloadAction<{
      data: Topic[],
      status: number
    }>) => {
      state.loading = false;
      state.topics = action.payload.data.map((o) => new Topic(o));
    })

     // load id course
     builder.addCase(requestLoadTopicsByIdCourse.fulfilled, (state, action: PayloadAction<{
      data: Topic[],
      status: number
    }>) => {
      state.loading = false;
      state.topics = action.payload.data.map((o) => new Topic(o));
    }) 

    //  // load parentId
    //  builder.addCase(requestLoadTopicsByParentId.fulfilled, (state, action: PayloadAction<{
    //   data: Topic[],
    //   status: number
    // }>) => {
    //   state.loading = false;
    //   state.topics = action.payload.data.map((o) => new Topic(o));
    // })

    // update topic
    builder.addCase(requestUpdateTopics.fulfilled, (state, action: PayloadAction<{
      data: Topic,
      status: number
    }>) => {
      state.loading = false;
      state.topicInfo = new Topic(action.payload.data)
    })
  }
})

export const { } = topicSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const topicState = (state: RootState) => state.topic

export default topicSlice.reducer