import React, { useState } from "react";
import "./ModalEdit.css";
import { updateUsers } from "../services/api";

/**
 * Modal de edição em massa dos usuários
 * @param {*} param0 
 * @returns 
 */
const ModalEdit = ({ selectedUsers, onClose, onUpdateSuccess }) => {

  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [isActive, setIsActive] = useState("");

  // função para enviar os usuários editado
  const handleSubmit = async () => {

    if(name.length > 0 && name.length < 3){

      alert("O nome deve ter pelo menos 3 caracteres.")

      return

    }

    const updatedFields = {}

    if(name) updatedFields.name = name
    if(groupId) updatedFields.groupId = Number(groupId)
    if(isActive !== "") updatedFields.isActive = isActive === "true"

    const payload = selectedUsers.map(user => ({ id: user.id, ...updatedFields }))
    
    try{

      await updateUsers(payload)

      onUpdateSuccess()

    }catch (error){

      console.error("Erro ao atualizar usuários", error)

      alert("Ocorreu um erro ao atualizar os usuário, contate a equipe técnica")

    }
  }

  // caso o usuário deseje cancelar a ação
  const closeModal = async () => {

    onClose()

  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="titleModal">Edição em massa</h2>
        <div className="fields-container">
          <div className="field">
            <label>Nome
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          <div className="field">
            <label>Grupo
              <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                <option value="">Selecione</option>
                <option value="1">Administrador</option>
                <option value="2">Monitor</option>
                <option value="3">Vendedor</option>
              </select>
            </label>
          </div>
          <div className="field">
            <label>Status
              <select value={isActive} onChange={(e) => setIsActive(e.target.value)}>
                <option value="">Selecione</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </label>
          </div>
        </div>
        <h3 className="titleList">Usuários selecionados</h3>
        <div className="table-container" style={{ height: "300px", overflowY: "auto" }}>
          <table className="user-table" style={{ height: "300px", overflowY: "auto" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Grupo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.group}</td>
                  <td>{user.isActive ? "Ativo" : "Inativo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="actionsModal">
          <button onClick={closeModal}>Cancelar</button>
          <button onClick={handleSubmit} disabled={name === '' && groupId === '' && isActive === ''}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;