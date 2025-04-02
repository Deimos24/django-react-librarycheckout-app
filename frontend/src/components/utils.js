export const parseErrorResponse = (error) => {
    if (!error.response || !error.response.data) {
        return "An unexpected error occurred.";
    }

    const data = error.response.data;

    if (typeof data === "string") {
        return data; // Handle plain string responses
    }

    if (data.detail) {
        return data.detail; // Handle single "detail" error messages
    }

    return Object.entries(data)
        .map(([field, errors]) => 
            Array.isArray(errors) ? `${field}: ${errors.join(", ")}` : `${field}: ${errors}`
        )
        .join("\n");
};