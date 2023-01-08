import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../pages/categorys/categorySlice";
import tagReducer from "../pages/tags/tagSlice";
import courseReducer from "../pages/courses/courseSlice";
import topicReducer from "../pages/courseDetail/topicSlice";
import topicDetailReducer from "../pages/courseDetail/topicDetailSlice";

export const store = configureStore({
    reducer: {
        category: categoryReducer,
        tag: tagReducer,
        course: courseReducer,
        topic: topicReducer,
        topicDetail: topicDetailReducer,
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;