import { useEffect, useState } from "react";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "./api/api";
import { ICurrentUser } from "./vo/ICurrentUser";
import { IUser } from "./vo/IUser";

interface LoginProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setUser: (user: IUser | null) => void;
}

const Login: React.FC<LoginProps> = ({
  username,
  password,
  setUsername,
  setPassword,
  setUser,
}) => {
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registerMode, setRegisterMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAuth = async () => {
    try {
      if (registerMode) {
        const response = await api.post<ICurrentUser>("/auth/register", {
          username,
          password,
          admin: isAdmin,
        });
        const currentUser = response.data;
        if (currentUser.authenticated) {
          setUser(currentUser.user);
          setErrorMessage(null);
        } else {
          setErrorMessage("Usuário já existente.");
        }
      } else {
        const response = await api.post<ICurrentUser>("/auth/login", {
          username,
          password,
        });
        const currentUser = response.data;
        if (currentUser.authenticated) {
          setUser(currentUser.user);
          setErrorMessage(null);
          return;
        }
        setErrorMessage("Usuário ou senha incorretos!");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao conectar com o servidor."
      );
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !registerMode) {
        handleAuth();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [registerMode, handleAuth]);

  return (
    <>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        {registerMode ? "Crie sua Conta" : "Faça seu Login"}
      </Text>

      <View style={styles.inputGroup}>
        <Icon name="user" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={registerMode ? "next" : "send"}
          onSubmitEditing={() => {
            if (!registerMode) {
              handleAuth();
            }
          }}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          returnKeyType={registerMode ? "done" : "send"}
          onSubmitEditing={() => {
            if (!registerMode) {
              handleAuth();
            }
          }}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Icon name={showPass ? "eye" : "eye-slash"} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {registerMode && (
        <View style={styles.checkboxGroup}>
          <Text style={styles.checkboxLabel}>Admin?</Text>
          <Switch value={isAdmin} onValueChange={setIsAdmin} />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {registerMode ? "REGISTRAR" : "ENTRAR NO SISTEMA"}
        </Text>
      </TouchableOpacity>

      {errorMessage && (
        <Text style={styles.wrongPasswordText}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        style={styles.toggleMode}
        onPress={() => {
          setRegisterMode(!registerMode);
          setErrorMessage(null);
        }}
      >
        <Text style={styles.toggleText}>
          {registerMode
            ? "Já tenho conta? Fazer Login"
            : "Não tenho conta? Registrar"}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 180,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
    color: "#1B3764",
    alignSelf: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#333",
  },
  checkboxGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 8,
    color: "#333",
  },
  button: {
    backgroundColor: "#1B3764",
    height: 48,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  wrongPasswordText: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 8,
  },
  toggleMode: {
    alignSelf: "center",
    marginTop: 16,
  },
  toggleText: {
    color: "#1B3764",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
