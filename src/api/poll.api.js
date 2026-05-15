import axiosInstance from "./axios.js";

export const createPoll = async (pollData) => {
    const response = await axiosInstance.post( "/polls", pollData);
    return response.data;
};

export const updatePoll = async (pollId,pollData) => {
    const response = await axiosInstance.put(`/polls/${pollId}`, pollData);
    return response.data;
};

export const deletePoll = async (pollId) => {
    const response = await axiosInstance.delete(`/polls/${pollId}`);
    return response.data;
};

export const getPollById = async (pollId) => {
        const response = await axiosInstance.get(`/polls/${pollId}`);
        return response.data;
    };

export const getPollByShareId = async (shareId) => {
    const response = await axiosInstance.get(`/polls/share/${shareId}`);
        return response.data;
    };

export const publishPoll = async (pollId) => {
    const response = await axiosInstance.patch(`/polls/${pollId}/publish`);
        return response.data;
    };

export const getPollAnalytics = async (pollId) => {
        const response = await axiosInstance.get( `/polls/${pollId}/analytics`);
        return response.data;
    };