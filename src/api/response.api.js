import axiosInstance from "./axios.js";

export const createResponse = async (responseData) => {
    const response = await axiosInstance.post("/responses", responseData);
    return response.data;
};

export const getResponsesByPoll = async (pollId) => {
    const response = await axiosInstance.get(`/responses/poll/${pollId}`);
    return response.data;
};

export const getResponsesByQuestion = async (questionId) => {
    const response = await axiosInstance.get(`/responses/question/${questionId}`);
    return response.data;
};

export const getPollAnalytics = async (pollId) => {
    const response = await axiosInstance.get(`/responses/poll/${pollId}/analytics`);
    return response.data;
};