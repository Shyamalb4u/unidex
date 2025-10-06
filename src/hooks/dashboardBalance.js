import { create } from "zustand";

const dashboardBalance = create((set, get) => ({
  incomeData: null,

  fetchIncomeData: async (address) => {
    if (!address) return;
    try {
      const api_link = process.env.REACT_APP_API_URL;
      const res = await fetch(api_link + "getDashboardBalance/" + address);
      const data = await res.json();

      if (data.data !== "No Data") {
        set({ incomeData: data.data });
        return data.data;
      }
    } catch (e) {
      console.log("Error fetching dashboard data:", e);
    }
  },
}));

export default dashboardBalance;
