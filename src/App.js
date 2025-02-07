import "./App.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchUsers, updateUser } from "./services/api";
import { FaCheckCircle, FaTimesCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import ModalEdit from "./components/ModalEdit";

function App(){

  const [showList, setShowList] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const listRef = useRef(null)

  // abre a modal
  const openModal = () => setIsModalOpen(true);

  // Função para carregar usuários
  const loadUsers = useCallback(async (reset = false) => {

    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true)

    try{

      const response = await fetchUsers(reset ? 1 : page, pageSize)

      if(response.data.length === 0){

        setHasMore(false)

      }else{

        setUsers((prev) => [...prev, ...response.data])

        setPage((prev) => prev + 1)

      }

    }catch(error){

      console.error("Erro ao carregar dados", error)

    }finally{

      setIsLoading(false)

    }
  }, [isLoading, hasMore, page, pageSize]);

  // Função para lidar com o scroll dentro da listagem
  const handleScroll = useCallback(() => {

    if(isLoading || !hasMore || !listRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current

    // Verifica se o usuário chegou ao final do container da tabela
    if(scrollTop + clientHeight >= scrollHeight - 50){

      console.log("Chegou ao final da listagem, carregando mais usuários...")

      loadUsers()

    }
  }, [isLoading, hasMore, loadUsers]);

  // recarrega os usuários após atualização
  const fetchAndUpdateUsers = async () => {

    setPage(1)
    setUsers([])
    setSelectedUsers([])
    setHasMore(true)

    loadUsers(true)

  };
  
  // caso a atualização ocorra com sucesso
  const handleUpdateSuccess = () => {

    alert("Usuários atualizados com sucesso!")

    fetchAndUpdateUsers()

    setIsModalOpen(false)

  };

  // função para editar um usuário
  const handleEditClick = (user) => {

    setEditingUserId(user.id)

    setEditedName(user.name)

  };

  // função para cancelar a edição do nome
  const handleCancelEdit = () => {

    setEditingUserId(null)

    setEditedName("")

  };

  // função para editar um único usuário
  const handleSaveEdit = async () => {

    if (!editingUserId || !editedName.trim()) return;
  
    try{

      const updatedUser = await updateUser(editingUserId, { name: editedName })
  
      if(updatedUser){

        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUserId ? { ...user, name: updatedUser.name } : user
          )
        )

        alert("Usuário atualizado com sucesso!")

      }
    }catch (error){

      console.error("Erro ao atualizar usuário:", error)

      alert("Falha ao atualizar usuário.")

    }
  
    setEditingUserId(null)
    setEditedName("")

  };

  // Carrega os dados iniciais quando a lista for exibida
  useEffect(() => {

    if(showList && !hasFetchedInitialData){

      loadUsers()

      setHasFetchedInitialData(true)

    }
  }, [showList, hasFetchedInitialData, loadUsers]);

  // Adiciona e remove o evento de scroll dentro do container da listagem
  useEffect(() => {
    
    const listElement = listRef.current

    if(!listElement) return

    listElement.addEventListener("scroll", handleScroll)

    return () => listElement.removeEventListener("scroll", handleScroll)

  }, [handleScroll]);

  // Seleciona um usuário
  const toggleSelectUser = (user) => {

    setSelectedUsers((prevSelected) => {

      const isSelected = prevSelected.some((u) => u.id === user.id)

      if(isSelected){

        return prevSelected.filter((u) => u.id !== user.id)

      }else{

        return [...prevSelected, user]

      }
    })
  };

  // Seleciona todos usuários de uma só vez
  const selectAllUsers = () => {

    if(selectedUsers.length === users.length){

      setSelectedUsers([])

    }else{

      setSelectedUsers(users)

    }
  };

  return (
    <div className="container">
      {!showList ? (
        <div className="box">
          <h1 className="title">Bem-vindo</h1>
          <p className="message">Interface criada por Gustavo Ari de Andrade</p>
          <button className="button" onClick={() => setShowList(true)}>
            Visualizar
          </button>
        </div>
      ) : (
        <div className="list-container">
          <h1 className="title">Lista de Usuários</h1>
          <div ref={listRef} className="table-container" style={{ height: "500px", overflowY: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={selectAllUsers} checked={selectedUsers.length === users.length} />
                  </th>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Grupo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.some((u) => u.id === user.id)}
                        onChange={() => toggleSelectUser(user)}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>{user.group}</td>
                    <td className="status">
                      {user.isActive ? <FaCheckCircle className="icon green" /> : <FaTimesCircle className="icon red" />}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <>
                          <button className="save-button" onClick={handleSaveEdit}>
                            <FaSave /> 
                          </button>
                          <button className="cancel-button" onClick={handleCancelEdit}>
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button className="edit-button" onClick={() => handleEditClick(user)}>
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && <p>Carregando...</p>}
            {!hasMore && <p style={{ textAlign: "center" }}>Todos os usuários carregados!</p>}
          </div>
          <div className="actions">
            {editingUserId ? (
              <>
                <button className="button cancel" onClick={handleCancelEdit}>Cancelar</button>
                <button className="button save" onClick={handleSaveEdit}>Enviar</button>
              </>
            ) : (
              <>
                <button className="button" onClick={selectAllUsers}>Selecionar Todos</button>
                <button className="button edit" onClick={openModal} disabled={selectedUsers.length === 0}>
                  Editar
                </button>
              </>
            )}
          </div>
          {isModalOpen && (
            <ModalEdit 
              selectedUsers={selectedUsers} 
              onUpdateSuccess={handleUpdateSuccess} 
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;