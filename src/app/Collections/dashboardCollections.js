import axios from "axios"

export const getUnfilteredData = async () => {
   const response = await axios.get(`api/Dashboard/getUnfilteredTicketList`)
   return response
}

export const getFilteredData = async (fromDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getFilteredTicketList?from_date=${fromDate}&to_date=${endDate}`)
   return response
}

export const getPriorityTicketCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getPriorityList?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getClusterTicketCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getClusterList?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getActiveOrgTicketCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getActiveOrgList?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getTicketTypesCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getTicketTypesCount?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getPlatformCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getPlatformCount?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getTicketStatusCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getTicketStatusCount?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getTicketCreatorList = async() => {
   const response = await axios.get(`api/Dashboard/getTicketCreatorList`)
   return response
}

export const getTechPerformanceList = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getTechPerformanceList?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getOverdueTickets = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getOverdueTickets?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getTicketsByStatus = async(startDate, endDate, status_id) => {
   const response = await axios.get(`api/Dashboard/getTicketsByStatus?from_date=${startDate}&to_date=${endDate}&status_id=${status_id}`)
   return response
}

export const getTeleTsPerc = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getTeleTsPerc?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getShopLocationTickets = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getShopLocationTickets?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getAllbranchesCount = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getAllbranchesCount?from_date=${startDate}&to_date=${endDate}`)
   return response
}

export const getUnassignedTicketList = async(startDate, endDate) => {
   const response = await axios.get(`api/Dashboard/getUnassignedTicketList?from_date=${startDate}&to_date=${endDate}`)
   return response
}

