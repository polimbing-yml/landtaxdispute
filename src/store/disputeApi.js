import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const disputeApi = createApi({
  reducerPath: "disputeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7028/api/" }),
  endpoints: (builder) => ({
    submitDispute: builder.mutation({
      query: (payload) => ({
        url: "dispute-submission",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useSubmitDisputeMutation } = disputeApi;