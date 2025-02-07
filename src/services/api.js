import axios from "axios";

const API_URL = "http://localhost:3001/users"; 

/**
 * Função para listagem dos usuários
 * @param {*} page 
 * @returns 
 */
export const fetchUsers = async (page, pageSize) => {

  try{

    const response = await axios.get(`${API_URL}?page=${page}&limit=${pageSize}`)

    return response.data
    
  }catch(error){

    console.error("Erro ao buscar usuários:", error)

    return []

  }
};

/**
 * Função para atualizar um usuário específico
 * @param {number} id 
 * @param {Object} userData 
 * @returns {Object} 
 */
export const updateUser = async (id, userData) => {

  try{

    const response = await axios.patch(`${API_URL}/${id}`, userData)

    return response.data

  }catch(error){

    console.error(`Erro ao atualizar usuário ${id}:`, error)

    throw error
    
  }
};

/**
 * Função para edição em massa dos usuários
 * @param {Array} users 
 * @returns 
 */
export const updateUsers = async (users) => {

    try{

      const response = await axios.post(`${API_URL}/bulk-update`, users);
  
      return response.data
  
    }catch (error){

      console.error("Erro ao atualizar usuários:", error)

      return null

    }
};