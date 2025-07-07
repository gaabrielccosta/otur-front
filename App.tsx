import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import { IUser } from "./components/vo/IUser";
import api from "./components/api/api";
import { IFormulario } from "./components/vo/IFormulario";
import Home from "./components/Home";
import CadastrarVinicula from "./components/CadastrarVinucula";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<IUser | null>(null);
  const [formularioResponse, setFormularioResponse] = useState<string | null>(
    ""
  );
  const [currentPage, setCurrentPage] = useState("Home");

  useEffect(() => {
    if (!user) return;

    const pegarRespostaFormulario = async () => {
      const response = await api.put<IFormulario>(
        `/formularios/buscar/${user.id}`
      );

      const formulario = response.data;
      if (formulario) {
        console.log("Resposta do formulário:", formulario.jsonResponse);
        setFormularioResponse(formulario.jsonResponse);
      } else {
        setCurrentPage("Questionario");
        setFormularioResponse(null);
      }
    };

    pegarRespostaFormulario();
  }, [user]);

  return (
    <View style={styles.container}>
      {!user && (
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          setUser={setUser}
        />
      )}
      {user && currentPage === "Questionario" && (
        <Formulario
          user={user}
          setFormularioResponse={setFormularioResponse}
          setCurrentPage={setCurrentPage}
        />
      )}
      {user && currentPage === "Home" && (
        <Home
          user={user}
          setUser={setUser}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      {user && currentPage === "Cadastrar" && (
        <CadastrarVinicula user={user} setCurrentPage={setCurrentPage} />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
