import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { IUser } from "./vo/IUser";
import Icon from "react-native-vector-icons/FontAwesome";
import { IForm } from "../App";

// Definindo as chaves possíveis de página para tipagem mais segura
export type PageKey = "Home" | "Questionario" | "Viniculas" | "Cadastrar";

interface HomeProps {
  user: IUser | null;
  currentPage: PageKey;
  setCurrentPage: (page: PageKey) => void;
  setUser: (user: IUser | null) => void;
  form: IForm;
}

const Home: React.FC<HomeProps> = ({
  user,
  currentPage,
  setCurrentPage,
  setUser,
  form,
}) => {
  const options: Array<{ key: PageKey; label: string; requireAdmin: boolean }> =
    [
      {
        key: "Questionario",
        label: "Questionário sobre vinhos",
        requireAdmin: false,
      },
      { key: "Viniculas", label: "Vinícolas da serra", requireAdmin: false },
      { key: "Cadastrar", label: "Cadastrar vinícola", requireAdmin: true },
    ];

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <View style={styles.wrapper}>
      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={24} color="#1B3764" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {options
          .filter((opt) => !opt.requireAdmin || user?.admin)
          .map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.button,
                currentPage === opt.key && styles.buttonActive,
              ]}
              onPress={() => {
                form.reset();
                setCurrentPage(opt.key);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  currentPage === opt.key && styles.buttonTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 180,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#1B3764",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginVertical: 8,
  },
  buttonActive: {
    backgroundColor: "#163158",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonTextActive: {
    fontWeight: "bold",
  },
});
