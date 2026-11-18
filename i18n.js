(function () {
  const SUPPORTED = ["pt", "en", "es"];
  const DEFAULT_LANG = "pt";

  const STRINGS = {
    pt: {
      "hero.badge": "Encontre a solução ideal",
      "hero.title1": "Qual equipamento Casale",
      "hero.title2": "é ideal para sua operação?",
      "hero.description":
        "Responda algumas perguntas sobre sua produção e descubra quais equipamentos Casale atendem às suas necessidades.",
      "hero.subtitle": "Recomendação na hora, em menos de 2 minutos!",

      "step1.title": "Vamos começar?",
      "step1.subtitle":
        "Conte-nos quem você é para personalizarmos sua experiência",
      "field.nome": "Nome",
      "field.nome.ph": "Digite seu nome",
      "field.funcao": "Função",
      "field.funcao.ph": "Ex: Proprietário",
      "btn.start": "Iniciar minha simulação",

      "stepper.1": "Identificação",
      "stepper.2": "Produção",
      "stepper.3": "Equipamento",
      "stepper.4": "Recomendação",

      "step2.title": "Produção",
      "step2.subtitle": "Qual é o tipo de produção da sua fazenda?",
      "prod.corte": "Apenas gado de corte",
      "prod.leite": "Apenas gado de leite",
      "prod.ambos": "Gado de corte e leite",

      "step3.title": "Equipamento",
      "step3.subtitle": "Qual equipamento você procura?",
      "equip.colhedora": "Colhedoras de forragem",
      "equip.distribuidor_esterco": "Distribuidores de esterco",
      "equip.distribuidor_racao": "Distribuidores de ração",
      "equip.misturador_racao": "Misturadores de ração total",
      "equip.moedor": "Moedores",

      "btn.back": "Voltar",
      "btn.continue": "Continuar",
      "alert.select_option": "Selecione uma opção.",
      "alert.select_equipment": "Selecione um equipamento.",
      "alert.fill_name": "Preencha seu nome para continuar.",
      "alert.fill_role": "Preencha sua função para continuar.",
    },

    en: {
      "hero.badge": "Find the ideal solution",
      "hero.title1": "Which Casale equipment",
      "hero.title2": "is ideal for your operation?",
      "hero.description":
        "Answer a few questions about your production and find out which Casale equipment meets your needs.",
      "hero.subtitle": "Instant recommendation, in under 2 minutes!",

      "step1.title": "Let's get started?",
      "step1.subtitle":
        "Tell us who you are so we can personalize your experience",
      "field.nome": "Name",
      "field.nome.ph": "Enter your name",
      "field.funcao": "Role",
      "field.funcao.ph": "E.g.: Owner",
      "btn.start": "Start my simulation",

      "stepper.1": "Identification",
      "stepper.2": "Production",
      "stepper.3": "Equipment",
      "stepper.4": "Recommendation",

      "step2.title": "Production",
      "step2.subtitle": "What type of production does your farm have?",
      "prod.corte": "Beef cattle only",
      "prod.leite": "Dairy cattle only",
      "prod.ambos": "Beef and dairy cattle",

      "step3.title": "Equipment",
      "step3.subtitle": "Which equipment are you looking for?",
      "equip.colhedora": "Forage harvesters",
      "equip.distribuidor_esterco": "Manure spreaders",
      "equip.distribuidor_racao": "Feed spreaders",
      "equip.misturador_racao": "Total mixed ration (TMR) mixers",
      "equip.moedor": "Grinders",

      "btn.back": "Back",
      "btn.continue": "Continue",
      "alert.select_option": "Select an option.",
      "alert.select_equipment": "Select an equipment.",
      "alert.fill_name": "Enter your name to continue.",
      "alert.fill_role": "Enter your role to continue.",
    },

    es: {
      "hero.badge": "Encuentre la solución ideal",
      "hero.title1": "¿Qué equipo Casale",
      "hero.title2": "es ideal para su operación?",
      "hero.description":
        "Responda algunas preguntas sobre su producción y descubra qué equipos Casale se adaptan a sus necesidades.",
      "hero.subtitle": "¡Recomendación al instante, en menos de 2 minutos!",

      "step1.title": "¿Comenzamos?",
      "step1.subtitle":
        "Cuéntenos quién es usted para personalizar su experiencia",
      "field.nome": "Nombre",
      "field.nome.ph": "Escriba su nombre",
      "field.funcao": "Cargo",
      "field.funcao.ph": "Ej.: Propietario",
      "btn.start": "Iniciar mi simulación",

      "stepper.1": "Identificación",
      "stepper.2": "Producción",
      "stepper.3": "Equipo",
      "stepper.4": "Recomendación",

      "step2.title": "Producción",
      "step2.subtitle": "¿Qué tipo de producción tiene su finca?",
      "prod.corte": "Solo ganado de carne",
      "prod.leite": "Solo ganado lechero",
      "prod.ambos": "Ganado de carne y leche",

      "step3.title": "Equipo",
      "step3.subtitle": "¿Qué equipo está buscando?",
      "equip.colhedora": "Cosechadoras de forraje",
      "equip.distribuidor_esterco": "Distribuidores de estiércol",
      "equip.distribuidor_racao": "Distribuidores de ración",
      "equip.misturador_racao": "Mezcladoras de ración total (TMR)",
      "equip.moedor": "Molinos",

      "btn.back": "Volver",
      "btn.continue": "Continuar",
      "alert.select_option": "Seleccione una opción.",
      "alert.select_equipment": "Seleccione un equipo.",
      "alert.fill_name": "Escriba su nombre para continuar.",
      "alert.fill_role": "Escriba su cargo para continuar.",
    },
  };

  let currentLang = DEFAULT_LANG;

  function normalize(code) {
    if (!code) return null;
    const c = String(code).toLowerCase().slice(0, 2);
    return SUPPORTED.includes(c) ? c : null;
  }

  function getCookie(name) {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function detectLanguage() {
    // 0) override para testes: ?lang=en
    const qs = new URLSearchParams(location.search).get("lang");
    if (normalize(qs)) return normalize(qs);

    // 1) <html lang="">
    const fromHtml = normalize(document.documentElement.lang);
    if (fromHtml) return fromHtml;

    // 2) prefixo da URL
    const m = location.pathname.match(/^\/(en|es|pt)(\/|$)/i);
    if (m) return m[1].toLowerCase();

    // 3) cookies comuns
    const fromCookie =
      normalize(getCookie("pll_language")) ||
      normalize(getCookie("wp-wpml_current_language")) ||
      normalize((getCookie("googtrans") || "").split("/").pop());
    if (fromCookie) return fromCookie;

    return DEFAULT_LANG;
  }

  function t(key) {
    return (
      (STRINGS[currentLang] && STRINGS[currentLang][key]) ||
      STRINGS[DEFAULT_LANG][key] ||
      key
    );
  }

  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
  }

  function setLang(lang, { silent = false } = {}) {
    const next = normalize(lang) || DEFAULT_LANG;
    if (next === currentLang && !silent) return;

    currentLang = next;
    apply();

    document.dispatchEvent(
      new CustomEvent("casale:languagechange", { detail: { lang: next } }),
    );
  }

  function init() {
    currentLang = detectLanguage();
    apply();

    // Plugins que trocam idioma sem recarregar a página
    new MutationObserver(() => {
      const detected = detectLanguage();
      if (detected !== currentLang) setLang(detected);
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  window.CasaleI18n = { t, setLang, apply, getLang: () => currentLang };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
