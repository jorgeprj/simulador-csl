/* ============================================================
   CASALE — VALIDAÇÕES
   Responsável por:
   - Inicializar intl-tel-input
   - Validar identificação
   - Validar telefone
   - Validar e-mail
   - Validar campos obrigatórios
   - Controlar país / estado / cidade
   ============================================================ */

let telefoneInput = null;
let telefoneIti = null;

/* ============================================================
   ESTADOS DO BRASIL
============================================================ */

const estadosBrasil = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

/* ============================================================
   INICIALIZAÇÃO
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  inicializarTelefone();
  inicializarPais();
});

/* ============================================================
   INTL TEL INPUT
============================================================ */

function inicializarTelefone() {
  const input = document.querySelector("#telefone");

  if (!input) {
    console.warn("Campo #telefone não encontrado.");
    return;
  }

  if (telefoneIti) {
    return;
  }

  telefoneInput = input;

  if (typeof window.intlTelInput !== "function") {
    console.error(
      "intl-tel-input não foi carregado. Verifique o script da biblioteca.",
    );

    return;
  }

  telefoneIti = window.intlTelInput(input, {
    initialCountry: "br",

    allowDropdown: true,

    showSelectedDialCode: true,

    nationalMode: true,

    loadUtils: () =>
      import(
        "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"
      ),
  });

  /*
   * IMPORTANTE:
   *
   * Não sincronizamos o país do telefone
   * com o campo #pais.
   *
   * O país do telefone é independente.
   */

  console.log("intl-tel-input inicializado.");
}

/* ============================================================
   PAÍS DA PESSOA / PROPRIEDADE
============================================================ */

function inicializarPais() {
  const paisInput = document.querySelector("#pais");

  if (!paisInput) {
    console.warn("Campo #pais não encontrado.");
    return;
  }

  /*
   * O país é independente do telefone.
   */
  paisInput.addEventListener("change", atualizarLocalizacao);

  /*
   * Estado inicial.
   */
  atualizarLocalizacao();
}

/* ============================================================
   LOCALIZAÇÃO
============================================================ */

function atualizarLocalizacao() {
  const paisInput = document.querySelector("#pais");
  const estadoInput = document.querySelector("#estado");
  const estadoField = document.querySelector("#estado-field");

  const cidadeInput = document.querySelector("#cidade");
  const cidadeField = document.querySelector("#cidade-field");

  if (
    !paisInput ||
    !estadoInput ||
    !estadoField ||
    !cidadeInput ||
    !cidadeField
  ) {
    return;
  }

  /*
   * O país considerado aqui é SOMENTE
   * o país da pessoa/propriedade.
   *
   * Não tem nenhuma relação com
   * o país selecionado no telefone.
   */
  const isBrasil = paisInput.value === "BR";

  if (isBrasil) {
    mostrarLocalizacaoBrasil(
      estadoInput,
      estadoField,
      cidadeInput,
      cidadeField,
    );

    return;
  }

  ocultarLocalizacao(
    estadoInput,
    estadoField,
    cidadeInput,
    cidadeField,
  );
}

/* ============================================================
   BRASIL
============================================================ */

function mostrarLocalizacaoBrasil(
  estadoInput,
  estadoField,
  cidadeInput,
  cidadeField,
) {
  estadoField.style.display = "";
  cidadeField.style.display = "";

  estadoInput.disabled = false;
  cidadeInput.disabled = false;

  estadoInput.required = true;
  cidadeInput.required = true;

  carregarEstadosBrasil(estadoInput);
}

/* ============================================================
   OUTROS PAÍSES
============================================================ */

function ocultarLocalizacao(
  estadoInput,
  estadoField,
  cidadeInput,
  cidadeField,
) {
  estadoField.style.display = "none";
  cidadeField.style.display = "none";

  estadoInput.disabled = true;
  cidadeInput.disabled = true;

  estadoInput.required = false;
  cidadeInput.required = false;

  estadoInput.value = "";
  cidadeInput.value = "";

  removerErroCampo("estado");
  removerErroCampo("cidade");
}

/* ============================================================
   CARREGA ESTADOS
============================================================ */

function carregarEstadosBrasil(estadoInput) {
  /*
   * Guarda o estado atualmente selecionado.
   */
  const estadoAtual = estadoInput.value;

  estadoInput.innerHTML = `
    <option value="">Selecione o estado</option>
  `;

  estadosBrasil.forEach((estado) => {
    const option = document.createElement("option");

    option.value = estado.value;
    option.textContent = estado.label;

    estadoInput.appendChild(option);
  });

  /*
   * Tenta preservar o estado selecionado.
   */
  if (estadosBrasil.some((estado) => estado.value === estadoAtual)) {
    estadoInput.value = estadoAtual;
  }
}

/* ============================================================
   TELEFONE
============================================================ */

function obterTelefoneInternacional() {
  if (!telefoneIti) {
    const input = document.querySelector("#telefone");

    return input ? input.value.trim() : "";
  }

  const numero = telefoneIti.getNumber();

  if (!numero) {
    return "";
  }

  return numero;
}

function telefoneValido() {
  if (!telefoneIti) {
    return false;
  }

  const valor = telefoneIti.getNumber();

  if (!valor) {
    return false;
  }

  return telefoneIti.isValidNumber();
}

/* ============================================================
   E-MAIL
============================================================ */

function emailValido(email) {
  if (!email) {
    return false;
  }

  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  return regex.test(email);
}

/* ============================================================
   CAMPO GENÉRICO
============================================================ */

function campoPreenchido(id) {
  const element = document.querySelector(`#${id}`);

  if (!element) {
    return false;
  }

  return element.value.trim() !== "";
}

/* ============================================================
   ERRO VISUAL
============================================================ */

function mostrarErroCampo(id, mensagem) {
  const element = document.querySelector(`#${id}`);

  if (!element) {
    return;
  }

  removerErroCampo(id);

  element.classList.add("field-error");

  const field = element.closest(".field");

  if (!field) {
    return;
  }

  const error = document.createElement("small");

  error.className = "validation-error";
  error.textContent = mensagem;

  field.appendChild(error);
}

function removerErroCampo(id) {
  const element = document.querySelector(`#${id}`);

  if (!element) {
    return;
  }

  element.classList.remove("field-error");

  const field = element.closest(".field");

  if (!field) {
    return;
  }

  const error = field.querySelector(".validation-error");

  if (error) {
    error.remove();
  }
}

/* ============================================================
   LIMPA TODOS OS ERROS
============================================================ */

function limparErrosValidacao() {
  document
    .querySelectorAll(".field-error")
    .forEach((element) => {
      element.classList.remove("field-error");
    });

  document
    .querySelectorAll(".validation-error")
    .forEach((element) => {
      element.remove();
    });
}

/* ============================================================
   VALIDAÇÃO DA IDENTIFICAÇÃO
============================================================ */

function validarIdentificacao() {
  limparErrosValidacao();

  let valido = true;

  /* NOME */

  const nome =
    obterValorValidacao("nome-completo") ||
    obterValorValidacao("nome");

  if (!nome) {
    const nomeCompleto = document.querySelector("#nome-completo");

    if (nomeCompleto) {
      mostrarErroCampo(
        "nome-completo",
        "Informe seu nome.",
      );
    } else {
      mostrarErroCampo(
        "nome",
        "Informe seu nome.",
      );
    }

    valido = false;
  }

  /* FUNÇÃO */

  const funcao =
    obterValorValidacao("funcao-completa") ||
    obterValorValidacao("funcao-inicial");

  if (!funcao) {
    const funcaoCompleta =
      document.querySelector("#funcao-completa");

    if (funcaoCompleta) {
      mostrarErroCampo(
        "funcao-completa",
        "Informe sua função.",
      );
    } else {
      mostrarErroCampo(
        "funcao-inicial",
        "Informe sua função.",
      );
    }

    valido = false;
  }

  /* TELEFONE */

  if (!telefoneValido()) {
    mostrarErroCampo(
      "telefone",
      "Informe um telefone válido.",
    );

    valido = false;
  }

  /* PROPRIEDADE */

  if (!campoPreenchido("propriedade")) {
    mostrarErroCampo(
      "propriedade",
      "Informe sua propriedade ou empresa.",
    );

    valido = false;
  }

  /* PAÍS DA PESSOA */

  if (!campoPreenchido("pais")) {
    mostrarErroCampo(
      "pais",
      "Informe o país.",
    );

    valido = false;
  }

  /*
   * CIDADE E ESTADO SÓ SÃO VALIDADOS
   * QUANDO O PAÍS É BRASIL.
   */

  const pais = obterValorValidacao("pais");

  if (pais === "BR") {
    if (!campoPreenchido("cidade")) {
      mostrarErroCampo(
        "cidade",
        "Informe sua cidade.",
      );

      valido = false;
    }

    if (!campoPreenchido("estado")) {
      mostrarErroCampo(
        "estado",
        "Informe seu estado.",
      );

      valido = false;
    }
  }

  /* E-MAIL */

  const email = obterValorValidacao("email");

  if (!email) {
    mostrarErroCampo(
      "email",
      "Informe seu e-mail.",
    );

    valido = false;
  } else if (!emailValido(email)) {
    mostrarErroCampo(
      "email",
      "Informe um e-mail válido.",
    );

    valido = false;
  }

  /* EQUIPAMENTO CASALE */

  const equipamento = document.querySelector(
    ".question-block .answer-option.selected[data-identification-answer]",
  );

  if (!equipamento) {
    mostrarErroEquipamento();

    valido = false;
  }

  if (!valido) {
    focarPrimeiroErro();
  }

  return valido;
}

/* ============================================================
   OBTÉM VALOR
============================================================ */

function obterValorValidacao(id) {
  const element = document.querySelector(`#${id}`);

  if (!element) {
    return "";
  }

  return element.value.trim();
}

/* ============================================================
   EQUIPAMENTO CASALE
============================================================ */

function mostrarErroEquipamento() {
  const block = document.querySelector(".question-block");

  if (!block) {
    return;
  }

  if (block.querySelector(".validation-error")) {
    return;
  }

  const error = document.createElement("small");

  error.className = "validation-error";

  error.textContent =
    "Selecione se já possui um equipamento Casale.";

  block.appendChild(error);
}

/* ============================================================
   FOCO NO PRIMEIRO ERRO
============================================================ */

function focarPrimeiroErro() {
  const primeiroErro =
    document.querySelector(".field-error");

  if (primeiroErro) {
    primeiroErro.focus();

    primeiroErro.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    return;
  }

  const equipamentoErro =
    document.querySelector(
      ".question-block .validation-error",
    );

  if (equipamentoErro) {
    equipamentoErro.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

/* ============================================================
   VALIDAÇÃO EM TEMPO REAL
============================================================ */

document.addEventListener("input", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (!target.id) {
    return;
  }

  removerErroCampo(target.id);
});

/* ============================================================
   SELECT — REMOVE ERRO AO ALTERAR
============================================================ */

document.addEventListener("change", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (!target.id) {
    return;
  }

  removerErroCampo(target.id);
});

/* ============================================================
   EQUIPAMENTO CASALE — REMOVE ERRO
============================================================ */

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const option = target.closest(
    ".question-block .answer-option[data-identification-answer]",
  );

  if (!option) {
    return;
  }

  const error = document.querySelector(
    ".question-block .validation-error",
  );

  if (error) {
    error.remove();
  }
});