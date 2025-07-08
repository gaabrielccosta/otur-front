import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { Controller, useWatch } from "react-hook-form";
import { IUser } from "./vo/IUser";
import { PageKey } from "./Home";
import { IForm } from "../App";

interface CadastrarViniculaProps {
  user: IUser | null;
  setCurrentPage: (page: PageKey) => void;
  form: IForm;
}

const CadastrarVinicula: React.FC<CadastrarViniculaProps> = ({
  user,
  form,
  setCurrentPage,
}) => {
  const { control, getValues, setValue } = form;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use useWatch to reactively update fotos when form state changes
  const fotos: Asset[] = useWatch({ control, name: "fotos", defaultValue: [] });

  const pickFotos = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 5,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setErrorMessage("Erro ao selecionar fotos");
        return;
      }
      if (response.assets) {
        const current: Asset[] = getValues("fotos") || [];
        setValue("fotos", [...current, ...response.assets]);
        setErrorMessage(null);
      }
    });
  };

  const removeFoto = (index: number) => {
    const current: Asset[] = getValues("fotos") || [];
    setValue(
      "fotos",
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    const nome = getValues("nome");
    const horarios = getValues("horarios");
    const instagram = getValues("instagram");
    const localizacao = getValues("localizacao");
    const novo = getValues("novo") ?? "true";
    const id = getValues("id") ?? -1;

    if (!nome || !horarios || !instagram || !localizacao) {
      setErrorMessage("Preencha todos os campos");
      return;
    }
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("nome", nome);
      formData.append("horarios", horarios);
      formData.append("instagram", instagram);
      formData.append("localizacao", localizacao);
      formData.append("novo", novo);

      // Append fotos from the reactive form state
      for (let idx = 0; idx < fotos.length; idx++) {
        const asset = fotos[idx];
        if (!asset.uri) continue;

        const response = await fetch(asset.uri);
        const blob = await response.blob();

        formData.append("fotos", blob, asset.fileName || `foto_${idx}.jpg`);
      }

      await fetch("http://localhost:8080/api/viniculas/postar", {
        method: "POST",
        body: formData,
      });
      const successPartMsg = novo === "true" ? "cadastrada" : "salva";
      setSuccessMessage(`Vinícola ${successPartMsg} com sucesso!`);
      setTimeout(() => {
        setCurrentPage("Viniculas");
      }, 1000);
    } catch (err) {
      setErrorMessage("Erro ao cadastrar vinícola");
    }
  };

  const handleDelete = async () => {
    const id = getValues("id") ?? -1;
    if (id === -1) return;

    await fetch(`http://localhost:8080/api/viniculas/deletar/${id}`, {
      method: "POST",
    });
    setSuccessMessage("Vinícula deletada com sucesso!");
    setTimeout(() => {
      setCurrentPage("Viniculas");
    }, 1000);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.homeIcon}
        onPress={() => setCurrentPage("Home")}
      >
        <Icon name="home" size={24} color="#1B3764" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Vinícola</Text>

        <Controller
          control={control}
          name="nome"
          defaultValue={""}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <TouchableOpacity style={styles.photoButton} onPress={pickFotos}>
          <Text style={styles.photoButtonText}>
            {fotos.length
              ? `${fotos.length} foto(s) selecionada(s)`
              : "Selecionar Fotos"}
          </Text>
        </TouchableOpacity>
        <View style={styles.previewContainer}>
          {fotos.map(
            (asset, idx) =>
              asset.uri && (
                <View key={idx} style={styles.previewWrapper}>
                  <Image
                    source={{ uri: asset.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFoto(idx)}
                  >
                    <Icon name="times-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )
          )}
        </View>

        <Controller
          control={control}
          name="horarios"
          defaultValue={""}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Horários (ex: 08:00 - 18:00)"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="instagram"
          defaultValue={""}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Instagram (@usuario)"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="localizacao"
          defaultValue={""}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Localização"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {getValues("novo") === "false" ? "Salvar" : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        {getValues("novo") === "false" && (
          <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        )}

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {successMessage && <Text style={styles.success}>{successMessage}</Text>}
      </ScrollView>
    </View>
  );
};

export default CadastrarVinicula;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  homeIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B3764",
    alignSelf: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
  photoButton: {
    backgroundColor: "#1B3764",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  previewWrapper: {
    position: "relative",
    marginRight: 8,
    marginBottom: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#1B3764",
    height: 48,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonDelete: {
    backgroundColor: "red",
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
  error: {
    color: "red",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  success: {
    color: "green",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
