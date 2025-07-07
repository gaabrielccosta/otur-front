import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface PerguntaMultiplaProps {
  pergunta: string;
  opcoes: string[];
  valoresSelecionados: string[];
  styles: any;
  onToggleOpcao: (opcao: string) => void;
}

const PerguntaMultipla: React.FC<PerguntaMultiplaProps> = ({
  pergunta,
  opcoes,
  valoresSelecionados,
  styles,
  onToggleOpcao,
}) => (
  <View style={styles.perguntaContainer}>
    <Text style={styles.perguntaTexto}>{pergunta}</Text>
    {opcoes.map((opcao, i) => {
      const selecionada = valoresSelecionados.includes(opcao);
      return (
        <TouchableOpacity
          key={i}
          style={styles.opcaoContainer}
          onPress={() => onToggleOpcao(opcao)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.checkbox, selecionada && styles.checkboxSelecionado]}
          >
            {selecionada && <Icon name="check" size={16} color="#fff" />}
          </View>
          <Text style={styles.opcaoTexto}>{opcao}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default PerguntaMultipla;
