// validators.js

export const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validatePoll = (pollData) => {

    if (!pollData.title?.trim()) {
        return "Poll title is required";
    }

    if (!pollData.expiresAt) {
        return "Expiry date is required";
    }

    return null;
};

export const validateQuestion = (question) => {

    if (!question.questionText?.trim()) {
        return "Question is required";
    }

    if (question.options.length < 2) {
        return "Minimum 2 options required";
    }

    return null;
};