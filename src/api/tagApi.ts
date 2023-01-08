import ENDPONTAPI from "../submodule/common/endpoint"
import { Tag } from "../submodule/models/tag"
import { ApiConfig } from "./config"

export const apiLoadTags = async (payload: {
    status: number
}) => {
    return ApiConfig(ENDPONTAPI.GET_TAGS_BY_STATUS, {
        params: {
            status: payload?.status
        }
    })
}

export const apiLoadTagsByIdCategory = async (payload: {
    idCategory: string[],
    status: number
}) => {
    return ApiConfig(ENDPONTAPI.GET_TAGS_BY_ID_CATEGORY, {
        params: {
            idCategory: payload?.idCategory,
            status: payload?.status
        }
    })
}

export const apiUpdateTag = async (payload: Tag) => {
    return ApiConfig(ENDPONTAPI.UPDATE_TAG, {
        payload
    })
}