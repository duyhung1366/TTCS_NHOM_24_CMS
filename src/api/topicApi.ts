import ENDPONTAPI from "../submodule/common/endpoint"
import { Topic } from "../submodule/models/topic"
import { ApiConfig } from "./config"

export const apiLoadTopics = async (payload: {
    status: number
}) => {
    return ApiConfig(ENDPONTAPI.GET_TOPICS_BY_STATUS, {
        params: {
            status: payload?.status
        }
    })
}

export const apiLoadTopicsByIdCourse = async (payload: {
    type: number,
    idCourse: string
}) => {
    return ApiConfig(ENDPONTAPI.GET_TOPICS_BY_ID_COURSE, {
        params: {
            idCourse: payload?.idCourse,
            type: payload?.type,
        }
    })
}


export const apiLoadTopicsByParentId = async (payload: {
    parentId: string
}) => {
    return ApiConfig(ENDPONTAPI.GET_TOPICS_BY_PARENT_ID, {
        params: {
            parentId: payload?.parentId,
        }
    })
}

export const apiUpdateTopic = async (payload: Topic) => {
    return ApiConfig(ENDPONTAPI.UPDATE_CATEGORY, {
        payload
    })
}
