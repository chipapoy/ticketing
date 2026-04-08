import axios from 'axios';


export const getTicketType = async () => {
  
  const response = await axios.get(`/api/TicketType/getList`);
  return response;
}

export const getTicketTypeStatus = async () => {
  const response = await axios.get(`/api/TicketType/getStatus`);
  return response;
}

export const getCategoryType = async () => {
  const response = await axios.get(`/api/Category/getList`);
  return response;
}

export const getCategoryTypeActive = async () => {
  const response = await axios.get(`api/Category/getList`);
  return response
}

export const getSubCategory = async () => {
  const response = await axios.get(`/api/SubCategory/getList`);
  return response;
}

export const getCluster = async () => {
  const response = await axios.get(`/api/Cluster/getList`);
  return response;
}

export const getClassification = async () => {
  const response = await axios.get(`/api/Classification/getList`)
  return response;
}

export const getDepartment = async () => {
  const response = await axios.get(`/api/Department/getList`)
  return response;
}

export const getSection = async () => {
  const response = await axios.get(`/api/Section/getList`)
  return response;
}

export const getShop = async () => {
  const response = await axios.get(`/api/Shop/getList`)
  return response;
}

export const getShopLoc = async () => {
  const response = await axios.get(`/api/ShopLocation/getList`)
  return response;
}

export const getTechnicians = async () => {
  const response = await axios.get(`/api/Technician/getList`)
  return response;
}

export const getPriority = async () => {
  const response = await axios.get(`/api/Priority/getList`)
  return response;
  setPriorityArr(response.data.result);
}

export const getPlatform = async () => {
  const response = await axios.get(`/api/Platform/getList`)
  return response;
}

export const getTeleTs = async () => {
  const response = await axios.get(`/api/TeleTs/getList`);
  return response;
}

export const getResolution = async () => {
  const response = await axios.get(`/api/Lists/resolution`);
  return response;
}

export const getCustomer = async () => {
  const response = await axios.get(`/api/Lists/customer`);
  return response;
}

export const getUserName = async () => {
  const response = await axios.get(`/api/Users/getList`);
  return response;
}

export const getStage = async () => {
  const response = await axios.get(`/api/Lists/stage`);
  return response;
}

export const getActiveOrg = async () => {
  const response = await axios.get(`/api/Lists/active_org`);
  return response;
}

export const getTicketStage = async () => {
  const response = await axios.get(`/api/Lists/ticket_stage`);
  return response;
}
export const getStatus = async () => {
  const response = await axios.get(`/api/Lists/ticket_status`);
  return response;
}

export const getTagging = async () => {
  const response = await axios.get(`/api/Lists/tech_tagging`);
  return response;
}

export const getHelpdeskTagging = async () => {
  const response = await axios.get(`/api/Lists/helpdesk_tagging`);
  return response;
}

export const getFtLeadTagging = async () => {
  const response = await axios.get(`/api/Lists/ftlead_tagging`);
  return response;
}

export const getSLA = async () => {
  const response = await axios.get(`/api/SLA/getList`);
  return response;
}
export const getRole= async () => {
  const response = await axios.get(`/api/Role/getList`);
  return response;
}

export const getTech = async () => {
  const response = await axios.get(`/api/Technician/getList`);
  return response;
}