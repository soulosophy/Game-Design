import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPortfolioContent = async () => {
  const response = await api.get("/portfolio");
  return response.data;
};

export const updatePortfolioContent = async (payload) => {
  const response = await api.put("/portfolio", payload);
  return response.data;
};

export const uploadProjectMedia = async (projectId, file) => {
  const formData = new FormData();
  formData.append("project_id", projectId);
  formData.append("file", file);

  const response = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteUploadedMedia = async (fileId) => {
  const response = await api.delete(`/uploads/${fileId}`);
  return response.data;
};

export const submitContactMessage = async (payload) => {
  const response = await api.post("/contact", payload);
  return response.data;
};

export const getContactMessages = async () => {
  const response = await api.get("/contact-messages");
  return response.data;
};