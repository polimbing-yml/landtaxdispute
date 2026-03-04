import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const disputeApi = createApi({
  reducerPath: "disputeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7028/api/" }),
  endpoints: (builder) => ({
    submitDispute: builder.mutation({
      query: (formData) => ({
        url: "dispute-submission",
        method: "POST",
        // DO NOT set Content-Type header; let the browser set it automatically
        // for multipart/form-data when FormData is used
        body: formData,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useSubmitDisputeMutation } = disputeApi;