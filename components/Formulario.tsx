import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PerguntaEscala from "./perguntas/PerguntaEscala";
import PerguntaMultipla from "./perguntas/PerguntaMultipla";
import PerguntaUnica from "./perguntas/PerguntaUnica";
import api from "./api/api";
import { IUser } from "./vo/IUser";

interface FormularioProps {
  user: IUser | null;
  setFormularioResponse: (response: string | null) => void;
  setCurrentPage: (page: string) => void;
}

const Formulario: React.FC<FormularioProps> = ({
  user,
  setFormularioResponse,
  setCurrentPage,
}) => {
  // Estados para as respostas
  const [respostaQ1, setRespostaQ1] = useState<string | null>(null);
  const [respostaQ2, setRespostaQ2] = useState<string | null>(null);
  const [respostaQ3, setRespostaQ3] = useState<string | null>(null);
  const [respostaQ4, setRespostaQ4] = useState<string | null>(null);
  const [respostaQ5, setRespostaQ5] = useState<string | null>(null);
  const [respostaQ6, setRespostaQ6] = useState<string | null>(null);
  const [respostaQ7, setRespostaQ7] = useState<string | null>(null);
  const [respostaQ8, setRespostaQ8] = useState<string | null>(null);
  const [respostaQ9, setRespostaQ9] = useState<string | null>(null);
  const [respostaQ10, setRespostaQ10] = useState<string[]>([]);
  const [respostasQ11, setRespostasQ11] = useState<Record<string, number>>({});
  const [respostasQ12, setRespostasQ12] = useState<Record<string, number>>({});
  const [respostaQ13, setRespostaQ13] = useState<string | null>(null);
  const [respostaQ14, setRespostaQ14] = useState<Record<string, number>>({});
  const [respostaQ15, setRespostaQ15] = useState<string | null>(null);
  const [respostaQ16, setRespostaQ16] = useState<string[]>([]);

  const [naoRespondeu, setNaoRespondeu] = useState(false);
  const [respostasEnviadas, setRespostasEnviadas] = useState(false);

  // Dados das perguntas
  const opcoesTipoVinho = [
    "Tinto",
    "Branco",
    "Rosé",
    "Espumante",
    "Não tenho preferência",
    "De acordo com o momento",
  ];

  const opcoesFrequenciaConsumo = [
    "Muito frequente (todos os dias)",
    "Frequente (de 03 a 05x por semana)",
    "Pouco frequente (no mínimo uma vez por semana)",
    "Socialmente (festas, almoços de negócios...)",
    "Nunca",
  ];

  const opcoesGrauConhecimento = [
    "Nenhum",
    "Fraco",
    "Médio",
    "Forte",
    "Muito forte",
  ];

  const opcoesSimNao = ["Sim", "Não"];

  const opcoesQ9 = ["Nenhuma", "Uma vez", "Duas vezes", "Três vezes ou mais"];

  const opcoesQ10 = [
    "Tour guiado",
    "Degustação",
    "Harmonização",
    "Compra de vinhos e produtos",
    "Participação em eventos",
    "Experiência exclusiva/diferenciada",
  ];

  const itensQ11 = [
    "Reputação da vinícola",
    "Qualidade dos vinhos",
    "Proximidade geográfica",
    "Valores das atividades",
    "Atividade específica na vinícola",
    "Projeto arquitetônico da vinícola",
  ];

  const itensQ12 = [
    "Provar vinhos",
    "Comprar vinhos",
    "Experimentar vinhos especiais",
    "Vivenciar experiências",
    "Convívio com amigos e familiares",
    "Aprender sobre vinhos",
    "Experimentar a gastronomia na região",
    "Conhecer as vinícolas",
    "Ver o processo de fabricação do vinho",
  ];

  const itensQ14 = [
    "Localização",
    "Clima",
    "Cultura",
    "Beleza natural",
    "Visitação a vinícolas",
    "Gastronomia",
    "Turismo de aventura",
    "Eventos e festivais",
    "Atelier de artesanato e lojas de produtos locais",
  ];

  const opcoesQ16 = [
    "Aventura",
    "Patrimônio",
    "Cultura",
    "Experiências",
    "Bem-estar",
    "Diversão",
    "Gastronomia",
    "Natureza",
    "Turismo de aventura",
    "Degustação de vinhos",
  ];

  // Funções para múltipla escolha
  const toggleOpcaoQ10 = (opcao: string) => {
    setRespostaQ10((prev) =>
      prev.includes(opcao) ? prev.filter((o) => o !== opcao) : [...prev, opcao]
    );
  };

  const toggleOpcaoQ16 = (opcao: string) => {
    setRespostaQ16((prev) =>
      prev.includes(opcao) ? prev.filter((o) => o !== opcao) : [...prev, opcao]
    );
  };

  // Funções para escala
  const setRespostaEscalaQ11 = (item: string, valor: number) => {
    setRespostasQ11((prev) => ({ ...prev, [item]: valor }));
  };

  const setRespostaEscalaQ12 = (item: string, valor: number) => {
    setRespostasQ12((prev) => ({ ...prev, [item]: valor }));
  };

  const setRespostaEscalaQ14 = (item: string, valor: number) => {
    setRespostaQ14((prev) => ({ ...prev, [item]: valor }));
  };

  // Envio de respostas
  const enviarRespostas = async () => {
    const respostas = {
      respostaQ1,
      respostaQ2,
      respostaQ3,
      respostaQ4,
      respostaQ5,
      respostaQ6,
      respostaQ7,
      respostaQ8,
      respostaQ9,
      respostaQ10,
      respostasQ11,
      respostasQ12,
      respostaQ13,
      respostaQ14,
      respostaQ15,
      respostaQ16,
    };

    let algumaNaoRespondida = Object.values(respostas).some(
      (value) =>
        value === null ||
        (Array.isArray(value)
          ? value.length === 0
          : typeof value === "object"
          ? Object.keys(value).length === 0
          : false)
    );

    if (!algumaNaoRespondida) {
      if (
        Object.keys(respostaQ14).length !== itensQ14.length ||
        Object.keys(respostasQ12).length !== itensQ12.length ||
        Object.keys(respostasQ11).length !== itensQ11.length
      ) {
        algumaNaoRespondida = true;
      }
    }

    if (algumaNaoRespondida) {
      setNaoRespondeu(true);
      setRespostasEnviadas(false);
      return;
    }

    setNaoRespondeu(false);
    setRespostasEnviadas(true);

    const jsonRespostas = JSON.stringify(respostas, null, 2);
    await api.post("/formularios/postar", {
      userId: user?.id,
      jsonResponse: jsonRespostas,
    });
    Alert.alert("Respostas enviadas", jsonRespostas);
    setFormularioResponse(jsonRespostas);

    setTimeout(() => {
      setCurrentPage("Home");
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.homeIcon}
        onPress={() => setCurrentPage("Home")}
      >
        <Icon name="home" size={24} color="#1B3764" />
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 50 }}
      >
        {/* Questões 1 a 3 */}
        <PerguntaUnica
          pergunta="Questão 01 - Qual tipo de vinho você prefere?"
          opcoes={opcoesTipoVinho}
          valorSelecionado={respostaQ1}
          onSelecionar={setRespostaQ1}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 02 - Com que frequência consome vinho?"
          opcoes={opcoesFrequenciaConsumo}
          valorSelecionado={respostaQ2}
          onSelecionar={setRespostaQ2}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 03 - Qual seu grau de conhecimento sobre vinho?"
          opcoes={opcoesGrauConhecimento}
          valorSelecionado={respostaQ3}
          onSelecionar={setRespostaQ3}
          styles={styles}
        />

        {/* Questões 4 a 12 */}
        <PerguntaUnica
          pergunta="Questão 04 - Você consegue perceber as diferentes tipologias e estilos de vinhos com base em suas características sensoriais e estruturais (taninos, estrutura, aromas, acidez...)?"
          opcoes={[
            "1 – Não identifica (não consigo identificar estilos)",
            "2 – Percepção limitada (às vezes percebo diferença, mas não sei nomear)",
            "3 – Reconhecimento básico (consigo identificar estilos mais comuns)",
            "4 – Reconhecimento avançado (reconheço estilos com facilidade e sei suas características)",
            "5 – Domínio técnico (tenho domínio técnico e sensorial sobre estilos)",
          ]}
          valorSelecionado={respostaQ4}
          onSelecionar={setRespostaQ4}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 05 - Você conhece a relação entre estilos de vinhos e harmonização com a gastronomia?"
          opcoes={[
            "1 – Nenhum conhecimento (não tenho conhecimento sobre harmonizações)",
            "2 – Conhecimento básico (sei que vinho combina com comida, mas não sei como)",
            "3 – Noções gerais (conheço algumas combinações básicas, ex: vinho branco com peixe)",
            "4 – Critérios aplicados (aplico critérios de harmonização na escolha dos vinhos)",
            "5 – Conhecimento técnico (entendo tecnicamente os princípios de harmonização)",
          ]}
          valorSelecionado={respostaQ5}
          onSelecionar={setRespostaQ5}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 06 - Você participa ou já participou de algum curso e/ou profissionalização sobre vinhos?"
          opcoes={opcoesSimNao}
          valorSelecionado={respostaQ6}
          onSelecionar={setRespostaQ6}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 07 - É membro de algum tipo de confraria, associação ou clube de vinho?"
          opcoes={opcoesSimNao}
          valorSelecionado={respostaQ7}
          onSelecionar={setRespostaQ7}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 08 - É a sua primeira vez em um destino enoturístico?"
          opcoes={opcoesSimNao}
          valorSelecionado={respostaQ8}
          onSelecionar={setRespostaQ8}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 09 - Quantas vezes por ano, em média, visita locais voltados ao enoturismo?"
          opcoes={opcoesQ9}
          valorSelecionado={respostaQ9}
          onSelecionar={setRespostaQ9}
          styles={styles}
        />

        <PerguntaMultipla
          pergunta="Questão 10 – Quais atividades você mais aprecia em uma visita a uma vinícola?"
          opcoes={opcoesQ10}
          valoresSelecionados={respostaQ10}
          onToggleOpcao={toggleOpcaoQ10}
          styles={styles}
        />

        <PerguntaEscala
          pergunta="Questão 11 - Quais são os principais fatores que influenciam na sua decisão ao optar por visitar uma vinícola? (1 - Nada importante; ... 5 - Extremamente Importante)"
          itens={itensQ11}
          respostas={respostasQ11}
          onResponder={setRespostaEscalaQ11}
          styles={styles}
        />

        <PerguntaEscala
          pergunta="Questão 12 - Quanto importante são para você os seguintes motivos ao decidir realizar uma visita para uma região produtora de vinhos? (1 - Nada importante; ... 5 - Extremamente Importante)"
          itens={itensQ12}
          respostas={respostasQ12}
          onResponder={setRespostaEscalaQ12}
          styles={styles}
        />

        {/* Questões 13 a 16 */}
        <PerguntaUnica
          pergunta="Questão 13 - Quanto o rótulo de um vinho dos Altos Montes te motivou a vir conhecer o destino?"
          opcoes={["Houve influência", "Não houve influência"]}
          valorSelecionado={respostaQ13}
          onSelecionar={setRespostaQ13}
          styles={styles}
        />

        <PerguntaEscala
          pergunta="Questão 14 - Considerando os motivos, qual o grau de importância que o fizeram optar pela Região da IP Altos Montes? (1 - Nada importante; ... 5 - Extremamente Importante)"
          itens={itensQ14}
          respostas={respostaQ14}
          onResponder={setRespostaEscalaQ14}
          styles={styles}
        />

        <PerguntaUnica
          pergunta="Questão 15 - Você tinha conhecimento prévio de que os Altos Montes são uma Indicação Geográfica?"
          opcoes={opcoesSimNao}
          valorSelecionado={respostaQ15}
          onSelecionar={setRespostaQ15}
          styles={styles}
        />

        <PerguntaMultipla
          pergunta="Questão 16 - Depois de conhecer a Região da IP Altos Montes, a quais fatores você a associa?"
          opcoes={opcoesQ16}
          valoresSelecionados={respostaQ16}
          onToggleOpcao={toggleOpcaoQ16}
          styles={styles}
        />

        <TouchableOpacity style={styles.button} onPress={enviarRespostas}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        {naoRespondeu && (
          <Text style={styles.naoRespondeuText}>
            Você não respondeu todas as perguntas!
          </Text>
        )}
        {respostasEnviadas && (
          <Text style={styles.respostasEnviadasText}>Respostas enviadas!</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Formulario;

const styles = StyleSheet.create({
  homeIcon: {
    position: "static",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  perguntaContainer: {
    marginBottom: 24,
  },
  perguntaTexto: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1B3764",
  },
  opcaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1B3764",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelecionado: {
    backgroundColor: "#1B3764",
  },
  opcaoTexto: {
    fontSize: 15,
    color: "#333",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: "#1B3764",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelecionado: {
    backgroundColor: "#1B3764",
  },
  checkboxIcon: {
    height: 10,
    width: 10,
    backgroundColor: "#fff",
  },
  circuloRadio: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1B3764",
    justifyContent: "center",
    alignItems: "center",
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
  naoRespondeuText: {
    color: "red",
    fontWeight: "600",
    fontSize: 16,
  },
  respostasEnviadasText: {
    color: "green",
    fontWeight: "600",
    fontSize: 16,
  },
});
