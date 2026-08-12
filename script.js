/**
 * ============================================================
 * SIMULADOR CASALE
 * ============================================================
 *
 * Estrutura dos arquivos:
 *
 * /data/
 *   colhedora.json
 *   outro-equipamento.json
 *
 * /data/recomendacoes/
 *   colhedora.json
 *   outro-equipamento.json
 *
 *
 * FLUXO:
 *
 * STEP 1
 * Identificação
 *
 * STEP 2
 * Produção
 *
 * STEP 3
 * Equipamento
 * + perguntas específicas carregadas do JSON
 *
 * STEP 4
 * Recomendação
 *
 * ============================================================
 */

/* ============================================================
   CONFIGURAÇÃO
============================================================ */

const DATA_PATH = "./data";

const RECOMMENDATIONS_PATH = "./data/recomendacoes";

/* ============================================================
   ESTADO GLOBAL
============================================================ */

let currentStep = 1;

/**
 * Estado principal da simulação
 */
let userAnswers = {
  identificacao: {},

  producao: null,

  equipamento: null,

  perguntasEquipamento: {},
};

/**
 * Perguntas do equipamento carregadas
 * do arquivo JSON.
 */
let currentEquipmentQuestions = [];

/**
 * Índice da pergunta atual.
 */
let currentEquipmentQuestionIndex = -1;

/**
 * Configuração do equipamento carregado.
 */
let currentEquipmentConfig = null;

/**
 * Recomendações carregadas do JSON.
 */
let currentRecommendations = [];

/**
 * Cache dos JSONs já carregados.
 *
 * Evita fazer fetch novamente
 * desnecessariamente.
 */
const jsonCache = {};

/* ============================================================
   INICIALIZAÇÃO
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  setupIdentification();

  setupProductionOptions();

  setupSimpleOptions();

  setupNavigation();

  updateStepper(1);
});

/* ============================================================
   STEP 1 — IDENTIFICAÇÃO
============================================================ */

function setupIdentification() {
  const button = document.querySelector("#continue-identification");

  const extraFields = document.querySelector("#extra-fields");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const nome = getInputValue("nome");

    const funcao = getInputValue("funcao-inicial");

    /*
     * Primeiro clique:
     *
     * valida nome e função,
     * salva os dados,
     * remove o hero,
     * mostra os demais campos.
     */

    if (!extraFields || !extraFields.classList.contains("visible")) {
      if (!nome || !funcao) {
        alert("Preencha nome e função para continuar.");

        return;
      }

      userAnswers.identificacao.nome = nome;

      userAnswers.identificacao.funcao = funcao;

      if (extraFields) {
        extraFields.classList.add("visible");
      }

      const page = document.querySelector(".casale-page");

      if (page) {
        page.classList.remove("onboarding-state");

        page.classList.add("simulation-state");
      }

      preencherCampo("nome-completo", nome);

      preencherCampo("funcao-completa", funcao);

      return;
    }

    /*
     * Segundo clique:
     *
     * salva todos os dados
     * da identificação.
     */

    salvarIdentificacao();

    /*
     * Vai para Produção.
     */

    goToStep(2);
  });
}

/* ============================================================
   SALVAR IDENTIFICAÇÃO
============================================================ */

function salvarIdentificacao() {
  userAnswers.identificacao = {
    nome: getInputValue("nome-completo") || getInputValue("nome"),

    funcao: getInputValue("funcao-completa") || getInputValue("funcao-inicial"),

    telefone: getInputValue("telefone"),

    propriedade: getInputValue("propriedade"),

    pais: getInputValue("pais"),

    cidade: getInputValue("cidade"),

    estado: getInputValue("estado"),

    email: getInputValue("email"),

    equipamentoCasale: obterEquipamentoCasaleSelecionado(),
  };
}

/* ============================================================
   AUXILIARES DE INPUT
============================================================ */

function getInputValue(id) {
  const element = document.querySelector(`#${id}`);

  if (!element) {
    return "";
  }

  return element.value.trim();
}

/* ============================================================
   PREENCHER CAMPO
============================================================ */

function preencherCampo(id, valor) {
  const element = document.querySelector(`#${id}`);

  if (element) {
    element.value = valor || "";
  }
}

/* ============================================================
   EQUIPAMENTO CASALE — SIM/NÃO
============================================================ */

function obterEquipamentoCasaleSelecionado() {
  const selected = document.querySelector(
    ".question-block .answer-option.selected[data-identification-answer]",
  );

  if (!selected) {
    return null;
  }

  return selected.dataset.identificationAnswer || null;
}

/* ============================================================
   OPÇÕES SIM / NÃO
============================================================ */

function setupSimpleOptions() {
  const buttons = document.querySelectorAll(".question-block .answer-option");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.parentElement;

      if (!parent) {
        return;
      }

      parent.querySelectorAll(".answer-option").forEach((item) => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");
    });
  });
}

/* ============================================================
   STEP 2 — PRODUÇÃO
============================================================ */

function setupProductionOptions() {
  const options = document.querySelectorAll("#step-2 .selectable");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");

      userAnswers.producao = obterValorOpcao(option);

      /*
       * Também guardamos a key original
       * caso exista no HTML.
       */

      if (option.dataset.key) {
        userAnswers.producaoKey = option.dataset.key;
      }
    });
  });
}

/* ============================================================
   VALOR DA OPÇÃO
============================================================ */

function obterValorOpcao(option) {
  if (!option) {
    return "";
  }

  /*
   * Prioridade:
   *
   * data-key
   * data-value
   * value
   * texto
   */

  if (option.dataset && option.dataset.key) {
    return option.dataset.key;
  }

  if (option.dataset && option.dataset.value) {
    return option.dataset.value;
  }

  if (option.value) {
    return option.value;
  }

  return option.innerText.trim();
}

/* ============================================================
   NAVEGAÇÃO
============================================================ */

function setupNavigation() {
  /*
   * Botões continuar
   */

  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.id === "continue-identification") {
      return;
    }

    /*
     * Os botões dinâmicos do Step 3
     * possuem IDs próprios e serão
     * configurados quando forem criados.
     */

    if (
      button.id === "continue-equipment-selection" ||
      button.id === "continue-question"
    ) {
      return;
    }

    button.addEventListener("click", () => {
      /*
       * STEP 2
       */

      if (currentStep === 2) {
        continuarProducao();

        return;
      }

      /*
       * STEP 3
       */

      if (currentStep === 3) {
        continuarPerguntaEquipamento();
      }
    });
  });

  /*
   * Botões voltar estáticos.
   */

  document.querySelectorAll(".btn-secondary").forEach((button) => {
    if (button.id === "back-equipment" || button.id === "back-question") {
      return;
    }

    button.addEventListener("click", () => {
      voltarEtapa();
    });
  });
}

/* ============================================================
   CONTINUAR PRODUÇÃO
============================================================ */

function continuarProducao() {
  const selected = document.querySelector("#step-2 .selectable.selected");

  if (!selected) {
    alert("Selecione uma opção.");

    return;
  }

  userAnswers.producao = obterValorOpcao(selected);

  /*
   * A produção também é a chave
   * utilizada para localizar o JSON.
   *
   * Exemplo:
   *
   * produção = colhedora
   *
   * /data/colhedora.json
   */

  iniciarEquipamento();
}

/* ============================================================
   STEP 3 — EQUIPAMENTO
============================================================ */

function iniciarEquipamento() {
  userAnswers.equipamento = null;

  currentEquipmentQuestions = [];

  currentEquipmentQuestionIndex = -1;

  currentEquipmentConfig = null;

  currentRecommendations = [];

  goToStep(3);

  renderEquipmentSelection();
}

/* ============================================================
   SELEÇÃO DO EQUIPAMENTO
============================================================ */

function renderEquipmentSelection() {
  const section = document.querySelector("#step-3");

  if (!section) {
    return;
  }

  section.innerHTML = `

    <div class="step-header">

      <h3>Equipamento</h3>

      <p>
        Qual equipamento você procura?
      </p>

    </div>


    <div class="option-list">

      ${criarOpcaoEquipamento(
        "colhedoras_de_forragem",
        "Colhedoras de forragem",
        "colhedora",
      )}

      ${criarOpcaoEquipamento(
        "distribuidores_de_esterco",
        "Distribuidores de esterco",
        "distribuidor_esterco",
      )}

      ${criarOpcaoEquipamento(
        "distribuidores_de_racao",
        "Distribuidores de ração",
        "distribuidor_racao",
      )}

      ${criarOpcaoEquipamento(
        "misturadores_de_racao_total",
        "Misturadores de ração total",
        "misturador_racao",
      )}

      ${criarOpcaoEquipamento("moedores", "Moedores", "moedor")}

    </div>


    <footer class="actions">

      <button
        type="button"
        class="btn-secondary"
        id="back-equipment"
      >
        Voltar
      </button>

      <button
        type="button"
        class="btn-primary"
        id="continue-equipment-selection"
      >
        Continuar
      </button>

    </footer>

  `;

  setupDynamicEquipmentSelection();
}

/* ============================================================
   CRIAR OPÇÃO DE EQUIPAMENTO
============================================================ */

function criarOpcaoEquipamento(value, text, key) {
  return `

    <button
      type="button"
      class="answer-option selectable equipment-option"
      data-value="${value}"
      data-equipment="${key}"
    >

      <span class="radio"></span>

      ${text}

    </button>

  `;
}

/* ============================================================
   EVENTOS — EQUIPAMENTO
============================================================ */

function setupDynamicEquipmentSelection() {
  const options = document.querySelectorAll("#step-3 .equipment-option");

  const continueButton = document.querySelector(
    "#continue-equipment-selection",
  );

  const backButton = document.querySelector("#back-equipment");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");

      userAnswers.equipamento = {
        valor: option.dataset.value,

        key: option.dataset.equipment,
      };
    });
  });

  if (continueButton) {
    continueButton.addEventListener("click", async () => {
      if (!userAnswers.equipamento) {
        alert("Selecione um equipamento.");

        return;
      }

      await carregarPerguntasEquipamento();
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      goToStep(2);
    });
  }
}

/* ============================================================
   CARREGAR PERGUNTAS DO JSON
============================================================ */

async function carregarPerguntasEquipamento() {
  /*
   * A key do equipamento será usada
   * para encontrar o arquivo.
   *
   * Exemplo:
   *
   * colhedora
   *
   * /data/colhedora.json
   */

  const equipmentKey = userAnswers.equipamento.key;

  if (!equipmentKey) {
    mostrarErroCarregamento(
      "Não foi possível identificar o equipamento selecionado.",
    );

    return;
  }

  try {
    mostrarLoadingStep3("Carregando perguntas...");

    const config = await carregarJSON(`${DATA_PATH}/${equipmentKey}.json`);

    /*
     * Validação do JSON.
     */

    if (!config || !Array.isArray(config.perguntas)) {
      throw new Error(
        `O arquivo ${equipmentKey}.json não possui a estrutura esperada.`,
      );
    }

    currentEquipmentConfig = config;

    currentEquipmentQuestions = config.perguntas;

    userAnswers.perguntasEquipamento = {};

    currentEquipmentQuestionIndex = 0;

    /*
     * Carrega também as recomendações.
     */

    await carregarRecomendacoes(equipmentKey);

    renderEquipmentQuestion();
  } catch (error) {
    console.error("Erro ao carregar equipamento:", error);

    mostrarErroCarregamento(
      "Não foi possível carregar as perguntas deste equipamento. Verifique se o arquivo JSON está disponível.",
    );
  }
}

/* ============================================================
   CARREGAR RECOMENDAÇÕES
============================================================ */

async function carregarRecomendacoes(equipmentKey) {
  const url = `${RECOMMENDATIONS_PATH}/${equipmentKey}.json`;

  const data = await carregarJSON(url);

  /*
   * Permite diferentes formatos.
   *
   * Formato 1:
   *
   * [
   *   {...},
   *   {...}
   * ]
   *
   *
   * Formato 2:
   *
   * {
   *   "recomendacoes": [...]
   * }
   */

  if (Array.isArray(data)) {
    currentRecommendations = data;

    return;
  }

  if (Array.isArray(data?.recomendacoes)) {
    currentRecommendations = data.recomendacoes;

    return;
  }

  if (Array.isArray(data?.regras)) {
    currentRecommendations = data.regras;

    return;
  }

  throw new Error(
    `O arquivo de recomendações ${equipmentKey}.json não possui uma lista de recomendações válida.`,
  );
}

/* ============================================================
   FETCH / CACHE DOS JSONS
============================================================ */

async function carregarJSON(url) {
  /*
   * Se já carregamos esse arquivo,
   * usa o cache.
   */

  if (jsonCache[url]) {
    return jsonCache[url];
  }

  const response = await fetch(url, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao carregar ${url}`);
  }

  const data = await response.json();

  jsonCache[url] = data;

  return data;
}

/* ============================================================
   LOADING
============================================================ */

function mostrarLoadingStep3(mensagem) {
  const section = document.querySelector("#step-3");

  if (!section) {
    return;
  }

  section.innerHTML = `

    <div class="step-header">

      <h3>
        Aguarde...
      </h3>

      <p>
        ${mensagem}
      </p>

    </div>

    <div class="loading-state">

      <span>
        Carregando
      </span>

    </div>

  `;
}

/* ============================================================
   ERRO DE CARREGAMENTO
============================================================ */

function mostrarErroCarregamento(mensagem) {
  const section = document.querySelector("#step-3");

  if (!section) {
    return;
  }

  section.innerHTML = `

    <div class="step-header">

      <h3>
        Não foi possível continuar
      </h3>

      <p>
        ${mensagem}
      </p>

    </div>


    <div class="recommendation-card">

      <div class="machine-placeholder">
        ⚠️
      </div>

      <h4>
        Erro ao carregar os dados
      </h4>

      <p>
        Verifique os arquivos JSON e tente novamente.
      </p>

    </div>


    <footer class="actions">

      <button
        type="button"
        class="btn-secondary"
        id="back-loading-error"
      >
        Voltar
      </button>

      <button
        type="button"
        class="btn-primary"
        id="retry-loading-error"
      >
        Tentar novamente
      </button>

    </footer>

  `;

  const back = document.querySelector("#back-loading-error");

  const retry = document.querySelector("#retry-loading-error");

  if (back) {
    back.addEventListener("click", () => {
      renderEquipmentSelection();
    });
  }

  if (retry) {
    retry.addEventListener("click", () => {
      carregarPerguntasEquipamento();
    });
  }
}

/* ============================================================
   RENDERIZA PERGUNTA
============================================================ */

function renderEquipmentQuestion() {
  const section = document.querySelector("#step-3");

  if (!section) {
    return;
  }

  const question = currentEquipmentQuestions[currentEquipmentQuestionIndex];

  /*
   * Se não existe pergunta,
   * terminou o fluxo.
   */

  if (!question) {
    finalizarEquipamento();

    return;
  }

  /*
   * Recupera resposta anterior.
   *
   * Isso é importante para quando
   * o usuário clicar em "Voltar".
   */

  const previousAnswer = userAnswers.perguntasEquipamento[question.id];

  section.innerHTML = `

    <div class="step-header">

      <span class="question-counter">

        Pergunta
        ${currentEquipmentQuestionIndex + 1}
        de
        ${currentEquipmentQuestions.length}

      </span>


      <h3>
        ${escapeHTML(question.pergunta)}
      </h3>


      <p>
        Selecione uma das opções abaixo.
      </p>

    </div>


    <div class="option-list">

      ${question.opcoes
        .map((option) => {
          const selected = previousAnswer === option.valor ? "selected" : "";

          return `

              <button
                type="button"
                class="answer-option dynamic-option ${selected}"
                data-value="${escapeAttribute(option.valor)}"
                data-next="${escapeAttribute(option.proxima || "")}"
                data-action="${escapeAttribute(option.acao?.tipo || "")}"
              >

                <span class="radio"></span>

                ${escapeHTML(option.texto)}

              </button>

            `;
        })
        .join("")}

    </div>


    <footer class="actions">

      <button
        type="button"
        class="btn-secondary"
        id="back-question"
      >
        Voltar
      </button>


      <button
        type="button"
        class="btn-primary"
        id="continue-question"
      >
        Continuar
      </button>

    </footer>

  `;

  setupDynamicQuestionEvents();
}

/* ============================================================
   EVENTOS DA PERGUNTA
============================================================ */

function setupDynamicQuestionEvents() {
  const options = document.querySelectorAll("#step-3 .dynamic-option");

  const continueButton = document.querySelector("#continue-question");

  const backButton = document.querySelector("#back-question");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");
    });
  });

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      const selected = document.querySelector(
        "#step-3 .dynamic-option.selected",
      );

      if (!selected) {
        alert("Selecione uma opção.");

        return;
      }

      salvarRespostaPergunta(selected);
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      voltarPerguntaEquipamento();
    });
  }
}

/* ============================================================
   SALVAR RESPOSTA DA PERGUNTA
============================================================ */

function salvarRespostaPergunta(selected) {
  const question = currentEquipmentQuestions[currentEquipmentQuestionIndex];

  if (!question) {
    return;
  }

  const value = selected.dataset.value;

  /*
   * Salva exatamente o "valor"
   * definido no JSON.
   */

  userAnswers.perguntasEquipamento[question.id] = value;

  /*
   * Se a opção tiver:
   *
   * "acao": {
   *   "tipo": "resultado"
   * }
   *
   * encerra o fluxo.
   */

  if (selected.dataset.action === "resultado") {
    finalizarEquipamento();

    return;
  }

  /*
   * Próxima pergunta definida
   * explicitamente pelo JSON.
   */

  const nextId = selected.dataset.next;

  if (nextId) {
    const nextIndex = currentEquipmentQuestions.findIndex(
      (item) => item.id === nextId,
    );

    if (nextIndex === -1) {
      console.warn(`A pergunta "${nextId}" não foi encontrada no JSON.`);

      /*
       * Se o ID estiver errado,
       * tenta continuar pela ordem.
       */

      currentEquipmentQuestionIndex++;
    } else {
      currentEquipmentQuestionIndex = nextIndex;
    }
  } else {
    /*
     * Caso não exista "proxima",
     * continua pela ordem.
     */

    currentEquipmentQuestionIndex++;
  }

  /*
   * Terminou as perguntas?
   */

  if (currentEquipmentQuestionIndex >= currentEquipmentQuestions.length) {
    finalizarEquipamento();

    return;
  }

  renderEquipmentQuestion();
}

/* ============================================================
   VOLTAR PERGUNTA
============================================================ */

function voltarPerguntaEquipamento() {
  /*
   * Se estamos na primeira pergunta,
   * volta para a seleção de equipamento.
   */

  if (currentEquipmentQuestionIndex <= 0) {
    renderEquipmentSelection();

    return;
  }

  /*
   * Importante:
   *
   * O JSON usa "proxima", portanto simplesmente
   * diminuir o índice pode não funcionar
   * corretamente em fluxos condicionais.
   *
   * Por isso encontramos a pergunta anterior
   * que aponta para a pergunta atual.
   */

  const currentQuestion =
    currentEquipmentQuestions[currentEquipmentQuestionIndex];

  const previousIndex = encontrarPerguntaAnterior(currentQuestion.id);

  if (previousIndex !== -1) {
    currentEquipmentQuestionIndex = previousIndex;
  } else {
    /*
     * Fallback para JSON linear.
     */

    currentEquipmentQuestionIndex--;
  }

  renderEquipmentQuestion();
}

/* ============================================================
   ENCONTRAR PERGUNTA ANTERIOR
============================================================ */

function encontrarPerguntaAnterior(currentQuestionId) {
  /*
   * Procura uma pergunta cuja
   * opção "proxima" seja a pergunta atual.
   */

  for (let i = 0; i < currentEquipmentQuestions.length; i++) {
    const question = currentEquipmentQuestions[i];

    if (!Array.isArray(question.opcoes)) {
      continue;
    }

    const apontaParaAtual = question.opcoes.some(
      (option) => option.proxima === currentQuestionId,
    );

    if (apontaParaAtual) {
      return i;
    }
  }

  return -1;
}

/* ============================================================
   FINALIZAR EQUIPAMENTO
============================================================ */

function finalizarEquipamento() {
  console.log("=== FINALIZANDO SIMULAÇÃO ===");

  console.log(userAnswers);

  const resultado = buscarRecomendacao();

  if (!resultado) {
    mostrarResultadoConsultor(
      "Não encontramos uma recomendação específica para essa combinação. Fale com um consultor da Casale para receber a orientação mais adequada.",
    );

    return;
  }

  mostrarResultado(resultado);
}

/* ============================================================
   MOTOR DE RECOMENDAÇÃO
============================================================ */

function buscarRecomendacao() {
  if (!userAnswers.equipamento) {
    return null;
  }

  const respostas = userAnswers.perguntasEquipamento || {};

  /*
   * IMPORTANTE:
   *
   * Os nomes abaixo representam
   * os IDs das perguntas do JSON.
   *
   * Portanto:
   *
   * principal_uso_material
   * tipo_forragem
   * altura_material
   * potencia_tdp
   * hectares
   *
   * são usados diretamente.
   */

  const dados = {
    /*
     * Produção.
     */

    tipo_gado: userAnswers.producao,

    /*
     * Equipamento.
     */

    equipamento: userAnswers.equipamento.valor,

    equipamento_key: userAnswers.equipamento.key,

    /*
     * Perguntas da colhedora.
     */

    principal_uso_material: respostas.principal_uso_material,

    uso_material: respostas.principal_uso_material,

    tipo_forragem: respostas.tipo_forragem,

    altura_material: respostas.altura_material,

    potencia_tdp: respostas.potencia_tdp,

    hectares: respostas.hectares,
  };

  console.group("CASALE — MOTOR DE RECOMENDAÇÃO");

  console.log("Dados do usuário:");

  console.table(dados);

  console.log("Regras carregadas:", currentRecommendations);

  console.groupEnd();

  /*
   * Testa todas as recomendações.
   */

  for (const regra of currentRecommendations) {
    const criterios =
      regra.criterios || regra.criterio || regra.condicoes || {};

    if (regraCombina(criterios, dados)) {
      console.log("✅ Recomendação encontrada:", regra);

      return regra;
    }
  }

  console.log("❌ Nenhuma recomendação encontrada.");

  return null;
}

/* ============================================================
   COMPARAÇÃO DOS CRITÉRIOS
============================================================ */

function regraCombina(criterios, respostas) {
  for (const campoOriginal in criterios) {
    const criterio = criterios[campoOriginal];

    /*
     * Permite que o JSON da recomendação
     * use nomes ligeiramente diferentes.
     */

    const campo = normalizarNomeCampo(campoOriginal);

    /*
     * Procura a resposta.
     */

    let resposta = respostas[campo];

    /*
     * Caso não encontre,
     * tenta o nome original.
     */

    if (resposta === undefined) {
      resposta = respostas[campoOriginal];
    }

    /*
     * "*" significa qualquer valor.
     */

    if (normalizarValor(criterio) === "*") {
      continue;
    }

    /*
     * Critério específico,
     * mas usuário não respondeu.
     */

    if (resposta === null || resposta === undefined || resposta === "") {
      return false;
    }

    /*
     * Comparação normalizada.
     */

    if (normalizarValor(criterio) !== normalizarValor(resposta)) {
      return false;
    }
  }

  return true;
}

/* ============================================================
   NORMALIZAR NOME DO CAMPO
============================================================ */

function normalizarNomeCampo(campo) {
  const aliases = {
    uso_material: "principal_uso_material",

    principal_uso: "principal_uso_material",

    principal_uso_material: "principal_uso_material",
  };

  return aliases[campo] || campo;
}

/* ============================================================
   NORMALIZAÇÃO DE VALORES
============================================================ */

function normalizarValor(valor) {
  if (valor === null || valor === undefined) {
    return "";
  }

  return String(valor)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

/* ============================================================
   RESULTADO
============================================================ */

function mostrarResultado(regra) {
  const resultado = regra?.resultado;

  if (!resultado) {
    mostrarResultadoConsultor(
      "Fale com um consultor da Casale para receber a recomendação mais adequada.",
    );

    return;
  }

  goToStep(4);

  const section = document.querySelector("#step-4");

  if (!section) {
    return;
  }

  /*
   * Resultado para consultor.
   */

  if (resultado.tipo === "consultor") {
    renderConsultorResult(section, resultado.valor);

    return;
  }

  /*
   * Resultado de produto.
   */

  renderProductResult(section, resultado.valor);
}

/* ============================================================
   RESULTADO CONSULTOR
============================================================ */

function mostrarResultadoConsultor(mensagem) {
  goToStep(4);

  const section = document.querySelector("#step-4");

  if (!section) {
    return;
  }

  renderConsultorResult(section, mensagem);
}

/* ============================================================
   RENDER RESULTADO CONSULTOR
============================================================ */

function renderConsultorResult(section, mensagem) {
  section.innerHTML = `

    <div class="step-header">

      <h3>
        Fale com um consultor
      </h3>

      <p>
        Encontramos uma aplicação que
        precisa de uma avaliação personalizada.
      </p>

    </div>


    <div class="recommendation-card">

      <div class="machine-placeholder">
        💬
      </div>


      <h4>
        Vamos encontrar a melhor solução
      </h4>


      <p>
        ${escapeHTML(mensagem)}
      </p>

    </div>


    ${criarResultadoAcoes()}

  `;

  configurarResultadoAcoes();
}

/* ============================================================
   RENDER RESULTADO PRODUTO
============================================================ */

function renderProductResult(section, produto) {
  section.innerHTML = `

    <div class="step-header">

      <h3>
        Recomendação
      </h3>


      <p>
        Encontramos uma solução para
        sua operação.
      </p>

    </div>


    <div class="recommendation-card">

      <div class="machine-placeholder">
        🚜
      </div>


      <h4>
        ${escapeHTML(produto)}
      </h4>


      <p>
        Essa solução foi identificada
        com base nas respostas fornecidas
        durante a simulação.
      </p>

    </div>


    ${criarResultadoAcoes()}

  `;

  configurarResultadoAcoes();
}

/* ============================================================
   AÇÕES DO RESULTADO
============================================================ */

function criarResultadoAcoes() {
  return `

    <footer class="result-actions">

      <button
        type="button"
        class="whatsapp-button"
        id="whatsapp-consultor"
      >

        <span class="button-icon">

          <svg
            viewBox="0 0 24 24"
            fill="none"
          >

            <path
              d="M20 11.5C20 16.2 16.2 20 11.5 20C10.2 20 9 19.7 7.9 19.2L4 20L4.8 16.3C4.2 15.1 4 13.8 4 12.5C4 7.8 7.8 4 12.5 4C17.2 4 20 7.8 20 11.5Z"
              stroke="currentColor"
              stroke-width="2"
            />

          </svg>

        </span>


        <span class="button-content">

          <strong>
            Falar com um consultor
          </strong>

          <small>
            Atendimento personalizado via WhatsApp
          </small>

        </span>


        <span class="arrow">
          →
        </span>

      </button>


      <button
        type="button"
        class="restart-button"
        id="restart-simulation"
      >

        <span>
          ↻
        </span>

        Refazer simulação

      </button>

    </footer>

  `;
}

/* ============================================================
   EVENTOS DO RESULTADO
============================================================ */

function configurarResultadoAcoes() {
  const restart = document.querySelector("#restart-simulation");

  if (restart) {
    restart.addEventListener("click", resetSimulation);
  }

  const whatsapp = document.querySelector("#whatsapp-consultor");

  if (whatsapp) {
    whatsapp.addEventListener("click", abrirWhatsApp);
  }
}

/* ============================================================
   WHATSAPP
============================================================ */

function abrirWhatsApp() {
  /*
   * Substituir posteriormente pelo
   * número oficial da Casale.
   */

  const numero = "5511999999999";

  const mensagem = encodeURIComponent(
    "Olá! Fiz uma simulação no site da Casale e gostaria de falar com um consultor.",
  );

  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}

/* ============================================================
   CONTINUAR PERGUNTA
============================================================ */

function continuarPerguntaEquipamento() {
  const selected = document.querySelector("#step-3 .dynamic-option.selected");

  if (!selected) {
    alert("Selecione uma opção.");

    return;
  }

  salvarRespostaPergunta(selected);
}

/* ============================================================
   VOLTAR ETAPA
============================================================ */

function voltarEtapa() {
  /*
   * Step 3 + pergunta aberta:
   * volta dentro do fluxo.
   */

  if (currentStep === 3 && currentEquipmentQuestionIndex >= 0) {
    voltarPerguntaEquipamento();

    return;
  }

  /*
   * Step 3 na seleção de equipamento:
   * volta para produção.
   */

  if (currentStep === 3) {
    goToStep(2);

    return;
  }

  /*
   * Demais etapas.
   */

  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

/* ============================================================
   TROCA DE ETAPA
============================================================ */

function goToStep(step) {
  currentStep = step;

  document.querySelectorAll(".form-step").forEach((section) => {
    section.classList.remove("active");
  });

  const section = document.querySelector(`#step-${step}`);

  if (section) {
    section.classList.add("active");
  }

  updateStepper(step);

  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
}

/* ============================================================
   STEPPER
============================================================ */

function updateStepper(step) {
  const steps = document.querySelectorAll(".step-item");

  steps.forEach((item, index) => {
    const number = index + 1;

    const circle = item.querySelector(".step-circle span");

    item.classList.remove("active", "completed");

    if (number < step) {
      item.classList.add("completed");

      if (circle) {
        circle.innerHTML = "✓";
      }
    } else if (number === step) {
      item.classList.add("active");

      if (circle) {
        circle.innerHTML = number;
      }
    } else {
      if (circle) {
        circle.innerHTML = number;
      }
    }
  });
}

/* ============================================================
   RESET
============================================================ */

function resetSimulation() {
  currentStep = 1;

  userAnswers = {
    identificacao: {},

    producao: null,

    equipamento: null,

    perguntasEquipamento: {},
  };

  currentEquipmentQuestions = [];

  currentEquipmentQuestionIndex = -1;

  currentEquipmentConfig = null;

  currentRecommendations = [];

  /*
   * Limpa inputs.
   */

  document.querySelectorAll("input, textarea, select").forEach((input) => {
    if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });

  /*
   * Remove seleções.
   */

  document.querySelectorAll(".selected").forEach((item) => {
    item.classList.remove("selected");
  });

  /*
   * Esconde campos extras.
   */

  const extra = document.querySelector("#extra-fields");

  if (extra) {
    extra.classList.remove("visible");
  }

  /*
   * Volta estado onboarding.
   */

  const page = document.querySelector(".casale-page");

  if (page) {
    page.classList.remove("simulation-state");

    page.classList.add("onboarding-state");
  }

  /*
   * Restaura Step 3.
   */

  restaurarStep3Original();

  /*
   * Volta Step 1.
   */

  goToStep(1);
}

/* ============================================================
   RESTAURAR STEP 3
============================================================ */

function restaurarStep3Original() {
  const section = document.querySelector("#step-3");

  if (!section) {
    return;
  }

  section.innerHTML = `

    <div class="step-header">

      <h3>
        Equipamento
      </h3>


      <p>
        Qual equipamento você procura?
      </p>

    </div>


    <div class="option-list">

      ${criarOpcaoEquipamento(
        "colhedoras_de_forragem",
        "Colhedoras de forragem",
        "colhedora",
      )}

      ${criarOpcaoEquipamento(
        "distribuidores_de_esterco",
        "Distribuidores de esterco",
        "distribuidor_esterco",
      )}

      ${criarOpcaoEquipamento(
        "distribuidores_de_racao",
        "Distribuidores de ração",
        "distribuidor_racao",
      )}

      ${criarOpcaoEquipamento(
        "misturadores_de_racao_total",
        "Misturadores de ração total",
        "misturador_racao",
      )}

      ${criarOpcaoEquipamento("moedores", "Moedores", "moedor")}

    </div>


    <footer class="actions">

      <button
        type="button"
        class="btn-secondary"
        id="back-equipment"
      >
        Voltar
      </button>


      <button
        type="button"
        class="btn-primary"
        id="continue-equipment-selection"
      >
        Continuar
      </button>

    </footer>

  `;

  setupDynamicEquipmentSelection();
}

/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ============================================================
   ESCAPE ATTRIBUTE
============================================================ */

function escapeAttribute(value) {
  return escapeHTML(value);
}

/* ============================================================
   DEBUG
============================================================ */

function debugAnswers() {
  console.group("========== CASALE ==========");

  console.log("Step atual:", currentStep);

  console.log("Respostas:", userAnswers);

  console.log("Perguntas carregadas:", currentEquipmentQuestions);

  console.log("Recomendações carregadas:", currentRecommendations);

  console.groupEnd();
}
