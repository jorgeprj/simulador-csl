# Integração RD Station — Simulador Casale

## 1. Objetivo

Este documento apresenta os campos necessários para integração entre o **Simulador Casale** e o **RD Station Marketing**.

O simulador coleta dados de identificação do usuário, informações da propriedade/operação, tipo de produção, equipamento de interesse, respostas às perguntas específicas do equipamento e a recomendação final gerada pelo motor de recomendação.

A integração será realizada através do evento de conversão da API do RD Station.

Endpoint utilizado:

```text
POST https://api.rd.services/platform/conversions
```

A API utiliza:

```text
event_type: CONVERSION
event_family: CDP
conversion_identifier: simulador_casale_teste
```

A API Key utilizada para a integração permite registrar conversões e criar/atualizar contatos no RD Station.

---

# 2. Campos nativos do RD Station

Os campos abaixo **já existem nativamente no RD Station**.

Não devem ser criados como campos personalizados.

| Campo no Simulador    | Campo RD Station | API Identifier   | Tipo     | Origem     |
| --------------------- | ---------------- | ---------------- | -------- | ---------- |
| Nome                  | Nome             | `name`           | STRING   | Step 1     |
| E-mail                | E-mail           | `email`          | STRING   | Step 1     |
| Função                | Cargo            | `job_title`      | STRING   | Step 1     |
| Telefone              | Telefone pessoal | `personal_phone` | STRING   | Step 1     |
| Cidade                | Cidade           | `city`           | STRING   | Step 1     |
| Estado                | Estado           | `state`          | STRING   | Step 1     |
| País                  | País             | `country`        | STRING   | Step 1     |
| Propriedade / Empresa | Nome da empresa  | `company_name`   | STRING   | Step 1     |
| Tags                  | Tags             | `tags`           | STRING[] | Integração |

Esses campos fazem parte dos campos padrão do RD Station Marketing. O RD documenta `email`, `name`, `job_title`, `state`, `city`, `country`, `personal_phone`, `company_name` e `tags`, entre outros, como campos padrão.

### Mapeamento

```text
nome
    ↓
name

email
    ↓
email

funcao
    ↓
job_title

telefone
    ↓
personal_phone

cidade
    ↓
city

estado
    ↓
state

pais
    ↓
country

propriedade
    ↓
company_name
```

---

# 3. Campos personalizados necessários

Precisamos criar os seguintes campos personalizados no RD Station.

Todos devem ser campos de **Contato**.

O RD Station exige que campos personalizados tenham um `api_identifier` no formato:

```text
cf_nome_do_campo
```

e esse identificador não pode ser alterado posteriormente.

---

## 3.1 Equipamento Casale existente

### Nome

```text
Possui equipamento Casale
```

### API Identifier

```text
cf_equipamento_casale
```

### Tipo

```text
STRING
```

### Valores esperados

```text
sim
nao
```

### Origem

Step 1 — Identificação.

HTML atual:

```html
<button
  type="button"
  class="answer-option"
  data-identification-answer="sim"
>
  Sim
</button>

<button
  type="button"
  class="answer-option"
  data-identification-answer="nao"
>
  Não
</button>
```

---

# 4. Tipo de produção

### Nome

```text
Tipo de produção
```

### API Identifier

```text
cf_tipo_producao
```

### Tipo

```text
STRING
```

### Valores atuais

```text
apenas_gado_corte
apenas_gado_leite
gado_corte_leite
```

### Exibição sugerida no RD

| Valor técnico       | Valor amigável        |
| ------------------- | --------------------- |
| `apenas_gado_corte` | Apenas gado de corte  |
| `apenas_gado_leite` | Apenas gado de leite  |
| `gado_corte_leite`  | Gado de corte e leite |

### Origem

Step 2 — Produção.

---

# 5. Equipamento procurado

### Nome

```text
Equipamento procurado
```

### API Identifier

```text
cf_equipamento
```

### Tipo

```text
STRING
```

### Valores atuais

```text
colhedora
distribuidor_esterco
distribuidor_racao
misturador_racao
moedor
```

### Exibição sugerida

| Valor técnico          | Valor amigável              |
| ---------------------- | --------------------------- |
| `colhedora`            | Colhedoras de forragem      |
| `distribuidor_esterco` | Distribuidores de esterco   |
| `distribuidor_racao`   | Distribuidores de ração     |
| `misturador_racao`     | Misturadores de ração total |
| `moedor`               | Moedores                    |

### Origem

Step 3 — Equipamento.

---

# 6. Recomendação final

### Nome

```text
Recomendação do Simulador
```

### API Identifier

```text
cf_recomendacao
```

### Tipo

```text
STRING
```

### Descrição

Armazena o produto ou orientação final gerada pelo motor de recomendação do Simulador Casale.

Exemplos:

```text
MIX 1000
MIX 2000
Colhedora X
Falar com consultor
```

Quando o motor não encontrar uma recomendação específica, o valor poderá ser:

```text
Falar com consultor
```

### Origem

Step 4 — Resultado da simulação.

---

# 7. Respostas completas da simulação

Além dos campos individuais, recomendamos criar um campo para armazenar **todas as respostas da simulação em conjunto**.

### Nome

```text
Respostas da Simulação
```

### API Identifier

```text
cf_respostas_simulacao
```

### Tipo

```text
STRING
```

### Formato

JSON serializado.

Exemplo:

```json
{
  "tipo_material_moer": "milho",
  "toneladas_feno": "10",
  "toneladas_graos": "20",
  "acionamento": "eletrico"
}
```

Esse campo funciona como um **backup completo da simulação**, independentemente dos campos individuais criados no RD.

---

# 8. Campos individuais das perguntas

O simulador utiliza arquivos JSON para definir as perguntas de cada equipamento.

Cada pergunta possui um `id`.

Exemplo:

```json
{
  "id": "tipo_material_moer",
  "pergunta": "O que você deseja moer?"
}
```

O JavaScript utiliza automaticamente esse ID para gerar o campo personalizado:

```text
cf_tipo_material_moer
```

Portanto, para cada pergunta que deverá ser utilizada em segmentações, automações ou análises dentro do RD Station, deve ser criado um campo personalizado correspondente.

---

## Regra de criação

Para uma pergunta:

```text
id: tipo_material_moer
```

criar:

```text
Nome: Tipo de material a moer
API Identifier: cf_tipo_material_moer
Tipo: STRING
```

Para:

```text
id: toneladas_graos
```

criar:

```text
Nome: Toneladas de grãos
API Identifier: cf_toneladas_graos
Tipo: STRING
```

Para:

```text
id: acionamento
```

criar:

```text
Nome: Tipo de acionamento
API Identifier: cf_acionamento
Tipo: STRING
```

---

# 9. IDs de perguntas atualmente previstos no simulador

O código atual já prevê perguntas com os seguintes IDs:

## Moedor

```text
tipo_material_moer
toneladas_feno
toneladas_graos
acionamento
```

Esses nomes aparecem atualmente na estrutura de dados/recomendação do simulador.

### Campos RD correspondentes

| Nome                    | API Identifier          | Tipo   |
| ----------------------- | ----------------------- | ------ |
| Tipo de material a moer | `cf_tipo_material_moer` | STRING |
| Toneladas de feno       | `cf_toneladas_feno`     | STRING |
| Toneladas de grãos      | `cf_toneladas_graos`    | STRING |
| Acionamento             | `cf_acionamento`        | STRING |

---

## Colhedora

O código atual prevê:

```text
principal_uso_material
tipo_forragem
altura_material
potencia_tdp
hectares
```

### Campos RD correspondentes

| Nome                      | API Identifier              | Tipo   |
| ------------------------- | --------------------------- | ------ |
| Principal uso do material | `cf_principal_uso_material` | STRING |
| Tipo de forragem          | `cf_tipo_forragem`          | STRING |
| Altura do material        | `cf_altura_material`        | STRING |
| Potência TDP              | `cf_potencia_tdp`           | STRING |
| Hectares                  | `cf_hectares`               | STRING |

---

# 10. Importante sobre novos equipamentos/perguntas

O sistema foi desenvolvido para permitir que novas perguntas sejam adicionadas aos arquivos JSON sem necessidade de alterar a lógica principal do JavaScript.

A regra será:

```text
ID da pergunta no JSON
        ↓
cf_ID_DA_PERGUNTA
        ↓
Campo personalizado no RD Station
```

Exemplo:

```json
{
  "id": "numero_animais",
  "pergunta": "Quantos animais você possui?"
}
```

gera:

```text
cf_numero_animais
```

Portanto, quando novos equipamentos ou perguntas forem adicionados ao simulador, novos campos personalizados poderão ser necessários.

---

# 11. Estrutura final recomendada

A estrutura de dados no RD Station ficará aproximadamente assim:

```text
CONTATO
│
├── CAMPOS NATIVOS
│   ├── name
│   ├── email
│   ├── job_title
│   ├── personal_phone
│   ├── city
│   ├── state
│   ├── country
│   ├── company_name
│   └── tags
│
└── CAMPOS PERSONALIZADOS
    │
    ├── cf_equipamento_casale
    ├── cf_tipo_producao
    ├── cf_equipamento
    ├── cf_recomendacao
    ├── cf_respostas_simulacao
    │
    ├── cf_tipo_material_moer
    ├── cf_toneladas_feno
    ├── cf_toneladas_graos
    ├── cf_acionamento
    │
    ├── cf_principal_uso_material
    ├── cf_tipo_forragem
    ├── cf_altura_material
    ├── cf_potencia_tdp
    ├── cf_hectares
    │
    └── [novos campos conforme novas perguntas]
```

---

# 12. Tags

As tags não precisam ser criadas como campos personalizados.

O RD Station possui o campo nativo:

```text
tags
```

O simulador poderá enviar tags como:

```json
"tags": [
  "simulador_casale",
  "simulador_casale_2026"
]
```

Posteriormente podemos utilizar tags adicionais para facilitar segmentação.

Exemplos:

```text
simulador_casale
simulador_casale_2026
simulador_colhedora
simulador_moedor
simulador_misturador
```

O campo `tags` é nativo e aceita uma lista de strings.

---

# 13. Identificador da conversão

O evento será identificado atualmente por:

```text
simulador_casale_teste
```

Esse valor é enviado em:

```json
{
  "conversion_identifier": "simulador_casale_teste"
}
```

O `conversion_identifier` identifica a conversão dentro do RD Station e o evento de conversão é registrado na timeline do contato.

### Para produção

Recomendamos alterar para:

```text
simulador_casale
```

ou:

```text
simulador_casale_recomendacao
```

---

# 14. Payload esperado

Depois da criação dos campos, o simulador poderá enviar uma conversão semelhante a:

```json
{
  "event_type": "CONVERSION",
  "event_family": "CDP",
  "payload": {
    "conversion_identifier": "simulador_casale_teste",

    "name": "João da Silva",
    "email": "joao@email.com",
    "job_title": "Produtor Rural",
    "personal_phone": "+5511999999999",

    "company_name": "Fazenda Boa Vista",

    "city": "Ribeirão Preto",
    "state": "SP",
    "country": "BR",

    "tags": [
      "simulador_casale",
      "simulador_casale_2026"
    ],

    "cf_equipamento_casale": "sim",

    "cf_tipo_producao": "apenas_gado_leite",

    "cf_equipamento": "moedor",

    "cf_recomendacao": "MIX 1000",

    "cf_respostas_simulacao": "{\"tipo_material_moer\":\"milho\",\"toneladas_feno\":\"10\",\"toneladas_graos\":\"20\",\"acionamento\":\"eletrico\"}",

    "cf_tipo_material_moer": "milho",

    "cf_toneladas_feno": "10",

    "cf_toneladas_graos": "20",

    "cf_acionamento": "eletrico"
  }
}
```

---

# 15. Lista para criação pela equipe RD

## Campos nativos — NÃO CRIAR

| Campo            | API Identifier   |
| ---------------- | ---------------- |
| Nome             | `name`           |
| E-mail           | `email`          |
| Cargo/Função     | `job_title`      |
| Telefone pessoal | `personal_phone` |
| Cidade           | `city`           |
| Estado           | `state`          |
| País             | `country`        |
| Nome da empresa  | `company_name`   |
| Tags             | `tags`           |

---

## Campos personalizados — CRIAR

|  # | Campo                     | API Identifier              | Tipo   |
| -: | ------------------------- | --------------------------- | ------ |
|  1 | Possui equipamento Casale | `cf_equipamento_casale`     | STRING |
|  2 | Tipo de produção          | `cf_tipo_producao`          | STRING |
|  3 | Equipamento procurado     | `cf_equipamento`            | STRING |
|  4 | Recomendação do Simulador | `cf_recomendacao`           | STRING |
|  5 | Respostas da Simulação    | `cf_respostas_simulacao`    | STRING |
|  6 | Tipo de material a moer   | `cf_tipo_material_moer`     | STRING |
|  7 | Toneladas de feno         | `cf_toneladas_feno`         | STRING |
|  8 | Toneladas de grãos        | `cf_toneladas_graos`        | STRING |
|  9 | Acionamento               | `cf_acionamento`            | STRING |
| 10 | Principal uso do material | `cf_principal_uso_material` | STRING |
| 11 | Tipo de forragem          | `cf_tipo_forragem`          | STRING |
| 12 | Altura do material        | `cf_altura_material`        | STRING |
| 13 | Potência TDP              | `cf_potencia_tdp`           | STRING |
| 14 | Hectares                  | `cf_hectares`               | STRING |

---

# 16. Observação sobre os campos das perguntas

Os campos 6 a 14 devem ser considerados os campos identificados a partir da estrutura atualmente prevista no código.

A fonte definitiva dos campos de perguntas deve ser os arquivos JSON do simulador:

```text
/data/*.json
```

Sempre que uma nova pergunta for criada com:

```json
"id": "novo_campo"
```

e for necessário disponibilizar essa informação individualmente no RD Station, deverá ser criado:

```text
cf_novo_campo
```

Além disso, todas as respostas continuarão sendo armazenadas conjuntamente em:

```text
cf_respostas_simulacao
```

---

# 17. Tipos de campos

A API atual do RD Station permite campos personalizados dos tipos:

```text
STRING
INTEGER
BOOLEAN
STRING[]
```

Para a primeira versão da integração, recomendamos utilizar `STRING` nos campos de perguntas, mesmo quando a resposta representar um número.

Isso mantém a integração flexível enquanto o questionário ainda está sendo estruturado.

Posteriormente, campos como:

```text
hectares
toneladas_feno
toneladas_graos
potencia_tdp
```

podem ser convertidos para `INTEGER` caso seja necessário realizar segmentações numéricas no RD Station.

---

# 18. Recomendação para o time RD Station

Solicitamos a criação dos campos personalizados acima como **campos de Contato**, com os respectivos `api_identifier`.

É importante que os `api_identifier` sejam criados exatamente conforme especificado, pois o simulador utilizará esses identificadores diretamente na API.

Exemplo:

```text
Nome:
Tipo de produção

API Identifier:
cf_tipo_producao
```

Não alterar:

```text
cf_tipo_producao
```

para:

```text
tipo_producao
```

ou:

```text
cf_tipo_de_producao
```

pois o simulador enviará exatamente:

```text
cf_tipo_producao
```

---

# 19. Segurança

A integração atual utiliza uma API Key do RD Station.

Durante a fase de testes, a chave está sendo utilizada diretamente pelo frontend do simulador.

Para produção, recomendamos avaliar a migração da chave para uma camada backend/serverless, evitando expor a credencial no JavaScript público.

A documentação do RD Station informa que API Keys são adequadas para eventos de conversão, mas são menos seguras que OAuth e podem ser ativadas/desativadas pelo gerenciamento de chaves.

---

# 20. Checklist para o RD Station

### Campos nativos

* [x] `name`
* [x] `email`
* [x] `job_title`
* [x] `personal_phone`
* [x] `city`
* [x] `state`
* [x] `country`
* [x] `company_name`
* [x] `tags`

### Campos personalizados

* [ ] `cf_equipamento_casale`
* [ ] `cf_tipo_producao`
* [ ] `cf_equipamento`
* [ ] `cf_recomendacao`
* [ ] `cf_respostas_simulacao`
* [ ] `cf_tipo_material_moer`
* [ ] `cf_toneladas_feno`
* [ ] `cf_toneladas_graos`
* [ ] `cf_acionamento`
* [ ] `cf_principal_uso_material`
* [ ] `cf_tipo_forragem`
* [ ] `cf_altura_material`
* [ ] `cf_potencia_tdp`
* [ ] `cf_hectares`

### Conversão

* [ ] Criar/validar conversão `simulador_casale_teste`
* [ ] Validar recebimento de campos padrão
* [ ] Validar recebimento de campos personalizados
* [ ] Validar atualização de contato existente pelo e-mail
* [ ] Validar registro da conversão na timeline
* [ ] Validar tags
* [ ] Validar recomendação final
* [ ] Validar respostas individuais
* [ ] Validar JSON completo em `cf_respostas_simulacao`

---

# 21. Resultado esperado

Após uma simulação completa, o RD Station deverá possuir um contato enriquecido com:

```text
┌─────────────────────────────────────┐
│ CONTATO                              │
├─────────────────────────────────────┤
│ Nome                                 │
│ E-mail                               │
│ Função                               │
│ Telefone                             │
│ Empresa/Propriedade                 │
│ Cidade                               │
│ Estado                               │
│ País                                 │
├─────────────────────────────────────┤
│ DADOS DO SIMULADOR                   │
├─────────────────────────────────────┤
│ Possui equipamento Casale            │
│ Tipo de produção                     │
│ Equipamento procurado                │
│ Recomendação                         │
│ Respostas completas                  │
├─────────────────────────────────────┤
│ RESPOSTAS ESPECÍFICAS                │
├─────────────────────────────────────┤
│ Pergunta 1                           │
│ Pergunta 2                           │
│ Pergunta 3                           │
│ ...                                  │
├─────────────────────────────────────┤
│ CONVERSÃO                            │
├─────────────────────────────────────┤
│ simulador_casale_teste               │
│ Tags                                 │
└─────────────────────────────────────┘
```

Isso permitirá futuramente criar segmentações como:

```text
Usuários que fizeram simulação
        ↓
Produção = Gado de leite
        ↓
Equipamento = Moedor
        ↓
Recomendação = Produto X
        ↓
Enviar campanha / distribuir para vendedor
```

e também:

```text
Produção = Gado de corte
+
Equipamento = Colhedora
+
Resposta específica = determinada opção
        ↓
Automação comercial
```

---

## Resumo para aprovação

### Nativos

**9 campos nativos serão utilizados:**

```text
name
email
job_title
personal_phone
company_name
city
state
country
tags
```

### Personalizados

**14 campos personalizados estão previstos nesta primeira versão:**

```text
cf_equipamento_casale
cf_tipo_producao
cf_equipamento
cf_recomendacao
cf_respostas_simulacao

cf_tipo_material_moer
cf_toneladas_feno
cf_toneladas_graos
cf_acionamento

cf_principal_uso_material
cf_tipo_forragem
cf_altura_material
cf_potencia_tdp
cf_hectares
```

**Novos campos `cf_...` poderão ser adicionados conforme novas perguntas forem incluídas nos JSONs do simulador.**
