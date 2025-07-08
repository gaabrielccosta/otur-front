import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { IUser } from "./vo/IUser";
import { IVinicula } from "./vo/IVinicula";
import { IAvaliacao } from "./vo/IAvaliacao";

interface ListaViniculasProps {
  setCurrentPage: (page: string) => void;
  user: IUser | null;
}

const ListaViniculas: React.FC<ListaViniculasProps> = ({
  user,
  setCurrentPage,
}) => {
  const [viniculas, setViniculas] = useState<IVinicula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<IVinicula | null>(null);

  const [reviews, setReviews] = useState<IAvaliacao[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViniculas = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/viniculas");
        if (!res.ok) throw new Error("Erro ao buscar vinícolas");
        const data: IVinicula[] = await res.json();
        setViniculas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchViniculas();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingReviews(true);

    fetch(`http://localhost:8080/api/viniculas/${selected.id}/avaliacoes`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar avaliações");
        return res.json();
      })
      .then((data: IAvaliacao[]) => setReviews(data))
      .catch((err) => setReviewError(err.message))
      .finally(() => setLoadingReviews(false));
  }, [selected]);

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5 || !reviewText.trim()) {
      Alert.alert(
        "Avaliação",
        "Selecione de 1 a 5 estrelas e escreva um comentário."
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/viniculas/${selected!.id}/avaliacoes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estrelas: rating,
            texto: reviewText,
            userId: user?.id,
          }),
        }
      );
      if (!res.ok) throw new Error("Falha ao enviar avaliação");
      setRating(0);
      setReviewText("");
      const reRes = await fetch(
        `http://localhost:8080/api/viniculas/${selected!.id}/avaliacoes`
      );
      const newReviews: IAvaliacao[] = await reRes.json();
      setReviews(newReviews);
      setReviewError(null);
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (selected) {
    return (
      <ScrollView contentContainerStyle={styles.detailContainer}>
        <TouchableOpacity
          onPress={() => setSelected(null)}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#1B3764" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{selected.nome}</Text>
        <ScrollView horizontal style={styles.photosContainer}>
          {selected.fotos.map((foto) => (
            <Image
              key={foto.id}
              source={{ uri: `http://localhost:8080/${foto.caminho}` }}
              style={styles.detailImage}
            />
          ))}
        </ScrollView>
        <Text style={styles.detailText}>Horários: {selected.horarios}</Text>
        <Text style={styles.detailText}>Instagram: {selected.instagram}</Text>
        <Text style={styles.detailText}>
          Localização: {selected.localizacao}
        </Text>

        <Text style={styles.sectionTitle}>Avaliações</Text>
        {loadingReviews ? (
          <ActivityIndicator />
        ) : reviews.length === 0 ? (
          <Text style={styles.noReviews}>Nenhuma avaliação ainda.</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.reviewItem}>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icon
                    key={i}
                    name={i <= r.estrelas ? "star" : "star-o"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewMeta}>
                {r.user.username} — {new Date(r.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.reviewText}>{r.texto}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Deixe sua avaliação</Text>
        <View style={styles.reviewInputContainer}>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Icon
                  name={i <= rating ? "star" : "star-o"}
                  size={24}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.reviewInput}
            placeholder="Escreva seu comentário..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline
          />
          {reviewError && <Text style={styles.reviewError}>{reviewError}</Text>}
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={handleSubmitReview}
            disabled={submitting}
          >
            <Text style={styles.reviewButtonText}>
              {submitting ? "Enviando..." : "Enviar Avaliação"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeIcon}
        onPress={() => setCurrentPage("Home")}
      >
        <Icon name="home" size={24} color="#1B3764" />
      </TouchableOpacity>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Lista de vinículas</Text>
      <FlatList
        data={viniculas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelected(item)}
          >
            {item.fotos.length > 0 && (
              <Image
                source={{
                  uri: `http://localhost:8080/${item.fotos[0].caminho}`,
                }}
                style={styles.thumbnail}
              />
            )}
            <Text style={styles.itemText}>{item.nome}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 180,
    marginBottom: 16,
    alignSelf: "center",
  },
  reviewMeta: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  homeIcon: {
    position: "static",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B3764",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
  detailContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    color: "#1B3764",
    marginLeft: 6,
    fontSize: 16,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B3764",
    marginBottom: 12,
  },
  photosContainer: {
    marginBottom: 12,
  },
  detailImage: {
    width: 200,
    height: 200,
    borderRadius: 6,
    marginRight: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B3764",
    marginTop: 16,
    marginBottom: 8,
  },
  reviewItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
  },
  reviewStars: {
    flexDirection: "row",
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  noReviews: {
    fontStyle: "italic",
    color: "#666",
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  reviewError: {
    color: "red",
    marginBottom: 8,
  },
  reviewButton: {
    backgroundColor: "#1B3764",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ListaViniculas;
