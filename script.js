/**
 * Simulador Casale
 * Controle das etapas e interações
 */

let currentStep = 1;

let userAnswers = {
  identificacao: {},

  producao: null,

  equipamento: null,
};

/**
 * Inicialização
 */

document.addEventListener("DOMContentLoaded", () => {
  setupIdentification();

  setupOptions();

  setupNavigation();
});

/**
 * ETAPA 1
 * Identificação
 */

function setupIdentification() {
  const button = document.querySelector("#continue-identification");

  const extraFields = document.querySelector("#extra-fields");

  button.addEventListener("click", () => {
    const nome = document.querySelector("#nome").value.trim();

    const funcao = document.querySelector("#funcao").value.trim();

    if (!nome || !funcao) {
      alert("Preencha nome e função para continuar.");

      return;
    }

    /**
     * Primeiro clique:
     *
     * Remove hero
     * Expande identificação
     */

    if (!extraFields.classList.contains("visible")) {
      extraFields.classList.add("visible");

      const page = document.querySelector(".casale-page");

      if (page) {
        page.classList.remove("onboarding-state");

        page.classList.add("simulation-state");
      }

      return;
    }

    /**
     * Segundo clique:
     * Vai para produção
     */

    userAnswers.identificacao = {
      nome,

      funcao,
    };

    goToStep(2);
  });
}

/**
 * Seleção das alternativas
 */

function setupOptions() {
  const selectable = document.querySelectorAll(".selectable");

  selectable.forEach((option) => {
    option.addEventListener("click", () => {
      const group = option.parentElement;

      group.querySelectorAll(".selectable").forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");

      saveAnswer(option);
    });
  });

  /**
   * Sim / Não
   */

  const simpleOptions = document.querySelectorAll(
    ".question-block .answer-option",
  );

  simpleOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.parentElement;

      group.querySelectorAll(".answer-option").forEach((item) => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");
    });
  });
}

/**
 * Salvar respostas
 */

function saveAnswer(option) {
  const value = option.innerText.trim();

  if (currentStep === 2) {
    userAnswers.producao = value;
  }

  if (currentStep === 3) {
    userAnswers.equipamento = value;
  }
}

/**
 * Navegação
 */

function setupNavigation() {
  /**
   * Botões continuar
   */

  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.id !== "continue-identification") {
      button.addEventListener("click", () => {
        if (currentStep === 2 && !userAnswers.producao) {
          alert("Selecione uma opção.");

          return;
        }

        if (currentStep === 3 && !userAnswers.equipamento) {
          alert("Selecione um equipamento.");

          return;
        }

        if (currentStep < 4) {
          goToStep(currentStep + 1);
        }
      });
    }
  });

  /**
   * Botões voltar
   */

  document.querySelectorAll(".btn-secondary").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });
}

/**
 * Troca etapa
 */

function goToStep(step) {
  currentStep = step;

  document.querySelectorAll(".form-step").forEach((section) => {
    section.classList.remove("active");
  });

  const section = document.querySelector("#step-" + step);

  if (section) {
    section.classList.add("active");
  }

  updateStepper(step);

  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
}

/**
 * Atualiza Stepper
 */

function updateStepper(step) {
  const steps = document.querySelectorAll(".step-item");

  steps.forEach((item, index) => {
    const number = index + 1;

    const circle = item.querySelector(".step-circle span");

    item.classList.remove("active", "completed");

    if (number < step) {
      item.classList.add("completed");

      circle.innerHTML = "✓";
    } else if (number === step) {
      item.classList.add("active");

      circle.innerHTML = number;
    } else {
      circle.innerHTML = number;
    }
  });
}

/**
 * Reset completo
 */

function resetSimulation() {
  currentStep = 1;

  userAnswers = {
    identificacao: {},

    producao: null,

    equipamento: null,
  };

  document.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  document.querySelectorAll(".selected").forEach((item) => {
    item.classList.remove("selected");
  });

  const extra = document.querySelector("#extra-fields");

  if (extra) {
    extra.classList.remove("visible");
  }

  const page = document.querySelector(".casale-page");

  if (page) {
    page.classList.remove("simulation-state");

    page.classList.add("onboarding-state");
  }

  goToStep(1);
}

/**
 * Futuro:
 *
 * carregarPerguntasJSON()
 *
 * buscarRecomendacao()
 *
 * enviarRDStation()
 *
 */
