/* ============================================================
   CASALE — VALIDAÇÕES E FORMATAÇÃO DE CAMPOS
============================================================ */

/**
 * Inicialização das validações
 */
document.addEventListener("DOMContentLoaded", () => {
  setupTelefone();
  setupValidacaoEmail();
  setupValidacaoCamposTexto();
});


/* ============================================================
   TELEFONE INTERNACIONAL
============================================================ */

function setupTelefone() {
  const telefone = document.querySelector("#telefone");

  if (!telefone) {
    return;
  }

  if (typeof intlTelInput === "undefined") {
    console.warn(
      "intl-tel-input não foi carregado. A validação do telefone não será ativada."
    );

    return;
  }

  const iti = intlTelInput(telefone, {
    initialCountry: "br",

    preferredCountries: [
      "br",
      "us",
      "pt",
      "ar",
      "py",
      "uy",
    ],

    separateDialCode: true,

    nationalMode: true,

    autoPlaceholder: "aggressive",

    loadUtils: () =>
      import(
        "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"
      ),
  });

  /*
   * Guarda a instância no próprio elemento.
   *
   * O script.js poderá utilizar:
   *
   * telefone._iti.getNumber()
   */
  telefone._iti = iti;
}


/**
 * Retorna o telefone em formato internacional.
 *
 * Exemplo:
 *
 * (16) 99999-9999
 *
 * retorna:
 *
 * +5516999999999
 */
function obterTelefoneInternacional() {
  const telefone = document.querySelector("#telefone");

  if (!telefone) {
    return "";
  }

  if (telefone._iti) {
    return telefone._iti.getNumber();
  }

  return telefone.value.trim();
}


/**
 * Verifica se o telefone informado é válido.
 */
function validarTelefone() {
  const telefone = document.querySelector("#telefone");

  if (!telefone) {
    return true;
  }

  /*
   * Se estiver vazio, não bloqueia.
   *
   * Caso queira tornar obrigatório,
   * podemos alterar posteriormente.
   */
  if (!telefone.value.trim()) {
    return true;
  }

  if (!telefone._iti) {
    return true;
  }

  if (!telefone._iti.isValidNumber()) {
    mostrarErroCampo(
      telefone,
      "Digite um número de telefone válido."
    );

    return false;
  }

  limparErroCampo(telefone);

  return true;
}


/* ============================================================
   EMAIL
============================================================ */

function setupValidacaoEmail() {
  const email = document.querySelector("#email");

  if (!email) {
    return;
  }

  email.addEventListener("blur", () => {
    validarEmail();
  });

  email.addEventListener("input", () => {
    limparErroCampo(email);
  });
}


function validarEmail() {
  const email = document.querySelector("#email");

  if (!email) {
    return true;
  }

  const valor = email.value.trim();

  /*
   * Campo vazio não é considerado erro.
   */
  if (!valor) {
    limparErroCampo(email);

    return true;
  }

  /*
   * Validação simples e segura para formulário.
   */
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(valor)) {
    mostrarErroCampo(
      email,
      "Digite um endereço de email válido."
    );

    return false;
  }

  limparErroCampo(email);

  return true;
}


/* ============================================================
   CAMPOS DE TEXTO
============================================================ */

function setupValidacaoCamposTexto() {
  const campos = [
    "#nome",
    "#nome-completo",
    "#funcao-inicial",
    "#funcao-completa",
    "#propriedade",
    "#cidade",
    "#estado",
    "#pais",
  ];

  campos.forEach((seletor) => {
    const campo = document.querySelector(seletor);

    if (!campo) {
      return;
    }

    campo.addEventListener("input", () => {
      limparErroCampo(campo);
    });
  });
}


/* ============================================================
   VALIDAÇÃO DE CAMPO OBRIGATÓRIO
============================================================ */

function validarCampoObrigatorio(
  seletor,
  mensagem = "Este campo é obrigatório."
) {
  const campo = document.querySelector(seletor);

  if (!campo) {
    return true;
  }

  const valor = campo.value.trim();

  if (!valor) {
    mostrarErroCampo(campo, mensagem);

    return false;
  }

  limparErroCampo(campo);

  return true;
}


/* ============================================================
   VALIDAÇÃO COMPLETA DA IDENTIFICAÇÃO
============================================================ */

export function validarIdentificacao() {
  let valido = true;

  /*
   * Nome
   */
  if (
    !validarCampoObrigatorio(
      "#nome-completo",
      "Informe seu nome."
    )
  ) {
    valido = false;
  }

  /*
   * Função
   */
  if (
    !validarCampoObrigatorio(
      "#funcao-completa",
      "Informe sua função."
    )
  ) {
    valido = false;
  }

  /*
   * Telefone
   */
  if (!validarTelefone()) {
    valido = false;
  }

  /*
   * Email
   */
  if (!validarEmail()) {
    valido = false;
  }

  return valido;
}


/* ============================================================
   MENSAGENS DE ERRO
============================================================ */

function mostrarErroCampo(campo, mensagem) {
  if (!campo) {
    return;
  }

  campo.classList.add("field-error");

  /*
   * Procura uma mensagem existente.
   */
  let mensagemElemento =
    campo.parentElement.querySelector(
      ".field-error-message"
    );

  /*
   * Cria caso não exista.
   */
  if (!mensagemElemento) {
    mensagemElemento =
      document.createElement("small");

    mensagemElemento.className =
      "field-error-message";

    campo.parentElement.appendChild(
      mensagemElemento
    );
  }

  mensagemElemento.textContent = mensagem;
}


function limparErroCampo(campo) {
  if (!campo) {
    return;
  }

  campo.classList.remove("field-error");

  const mensagemElemento =
    campo.parentElement.querySelector(
      ".field-error-message"
    );

  if (mensagemElemento) {
    mensagemElemento.remove();
  }
}


/* ============================================================
   LIMPAR TODAS AS VALIDAÇÕES
============================================================ */

function limparValidacoes() {
  document
    .querySelectorAll(".field-error")
    .forEach((campo) => {
      campo.classList.remove("field-error");
    });

  document
    .querySelectorAll(".field-error-message")
    .forEach((mensagem) => {
      mensagem.remove();
    });
}