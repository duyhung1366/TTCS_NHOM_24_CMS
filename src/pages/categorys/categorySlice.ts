import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { Category } from '../../submodule/models/category'
import { apiLoadCategorys, apiOrderCategory, apiUpdateCategory } from '../../api/categoryApi'

// Define a type for the slice state
interface CategoryState {
  categorys: Category[],
  loading: boolean,
  error: string,
  categoryInfo: Category | null
}

// Define the initial state using that type
const initialState: CategoryState = {
  categorys: [],
  loading: false,
  error: '',
  categoryInfo: null
}

export const requestLoadCategorys = createAsyncThunk('category/loadCategorys', async (props: { status: number }) => {
  const res = await apiLoadCategorys(props);
  return res.data
})

export const requestUpdateCategorys = createAsyncThunk('category/updateCategorys', async (props: Category) => {
  const res = await apiUpdateCategory(props);
  return res.data
})

export const requestOrderCategory = createAsyncThunk('category/orderCategory', async (props: {
  indexRange :any, 
  status : number 
}) => {
  const res = await apiOrderCategory(props);
  return res.data
})

export const categorySlice = createSlice({
  name: 'category',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    const actionList = [requestLoadCategorys, requestUpdateCategorys];
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
    builder.addCase(requestLoadCategorys.fulfilled, (state, action: PayloadAction<{
      data: Category[],
      status: number
    }>) => {
      state.loading = false;
      state.categorys = action.payload.data.map((o) => new Category(o));
    })

    // order category
    // builder.addCase(requestOrderCategory.fulfilled, (state, action: PayloadAction<{
    //   data: Category[],
    //   status: number
    // }>) => {
    //   state.loading = false;
    // })

    builder.addCase(requestUpdateCategorys.fulfilled, (state, action: PayloadAction<{
      data: Category,
      status: number
    }>) => {
      state.loading = false;
      state.categoryInfo = new Category(action.payload.data)
    })
  }
})

export const { } = categorySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const categoryState = (state: RootState) => state.category

export default categorySlice.reducer