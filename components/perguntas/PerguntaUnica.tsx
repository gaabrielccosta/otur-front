import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PerguntaUnicaProps {
  pergunta: string;
  opcoes: string[];
  valorSelecionado: string | null;
  styles: any;
  onSelecionar: (opcao: string) => void;
}

const PerguntaUnica: React.FC<PerguntaUnicaProps> = ({
  pergunta,
  opcoes,
  valorSelecionado,
  styles,
  onSelecionar,
}) => (
  <View style={styles.perguntaContainer}>
    <Text style={styles.perguntaTexto}>{pergunta}</Text>
    {opcoes.map((opcao, i) => {
      const selecionada = valorSelecionado === opcao;
      return (
        <TouchableOpacity
          key={i}
          style={styles.opcaoContainer}
          onPress={() => onSelecionar(opcao)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.radioCircle, selecionada && styles.radioSelecionado]}
          />
          <Text style={styles.opcaoTexto}>{opcao}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default PerguntaUnica;
