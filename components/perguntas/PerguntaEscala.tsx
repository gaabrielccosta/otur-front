import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PerguntaEscalaProps {
  pergunta: string;
  itens: string[];
  respostas: Record<string, number>;
  styles: any;
  onResponder: (item: string, valor: number) => void;
}

const PerguntaEscala: React.FC<PerguntaEscalaProps> = ({
  pergunta,
  itens,
  respostas,
  styles,
  onResponder,
}) => {
  const opcoesEscala = [1, 2, 3, 4, 5];

  return (
    <View style={styles.perguntaContainer}>
      <Text style={styles.perguntaTexto}>{pergunta}</Text>
      {itens.map((item, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 6, fontWeight: "500", color: "#222" }}>
            {item}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {opcoesEscala.map((valor) => {
              const selecionado = respostas[item] === valor;
              return (
                <TouchableOpacity
                  key={valor}
                  style={[
                    styles.circuloRadio,
                    selecionado && styles.radioSelecionado,
                    { marginRight: 8, paddingHorizontal: 6 },
                  ]}
                  onPress={() => onResponder(item, valor)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: selecionado ? "#fff" : "#333",
                      fontWeight: "600",
                    }}
                  >
                    {valor}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export default PerguntaEscala;
