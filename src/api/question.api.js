import axiosInstance from "./axios.js";

export const createQuestion = async (questionData) => {
    const response = await axiosInstance.post("/questions", questionData);
    return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
    const response = await axiosInstance.put(`/questions/${questionId}`, questionData);
    return response.data;
};

export const deleteQuestion = async (questionId) => {
    const response = await axiosInstance.delete(`/questions/${questionId}`);
    return response.data;
};

export const getQuestionsByPollId = async (pollId) => {
    const response = await axiosInstance.get(`/questions/poll/${pollId}`);
    return response.data;
};

export const getQuestionById = async (questionId) => {
    const response = await axiosInstance.get(`/questions/${questionId}`);
    return response.data;
};