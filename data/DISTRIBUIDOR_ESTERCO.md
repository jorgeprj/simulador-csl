# Guia de IDs — Recomendações do Distribuidor de Esterco

> **Regra principal:** os valores abaixo devem ser utilizados **exatamente como estão escritos** no arquivo `perguntas/distribuidor_esterco.json` e devem ser utilizados de forma idêntica no arquivo `recomendacoes/distribuidor_esterco.json`.

---

## 1. Sistema predominante da fazenda

**Campo:** `sistema_predominante`

| ID                           | Texto                      |
| ---------------------------- | -------------------------- |
| `compostagem`                | Compostagem                |
| `confinamento`               | Confinamento               |
| `compostagem_e_confinamento` | Compostagem e confinamento |

---

## 2. Tamanho do rebanho confinado

**Campo:** `tamanho_rebanho_confinado`

| ID                  | Texto                |
| ------------------- | -------------------- |
| `ate_200_animais`   | Até 200 animais      |
| `201_600_animais`   | 201 a 600 animais    |
| `acima_600_animais` | Acima de 600 animais |

---

## 3. Potência na TDP

**Campo:** `potencia_tdp`

| ID            | Texto           |
| ------------- | --------------- |
| `ate_70cv`    | Até 70 cv       |
| `70_85cv`     | 70 a 85 cv      |
| `86_200cv`    | 86 a 200 cv     |
| `acima_200cv` | Acima de 200 cv |

---

## 4. Sistema de pesagem

**Campo:** `sistema_pesagem`

| ID    | Texto |
| ----- | ----- |
| `sim` | Sim   |
| `nao` | Não   |

---

## 5. Área coberta

**Campo:** `area_coberta`

| ID            | Texto                 |
| ------------- | --------------------- |
| `ate_50ha`    | Até 50 hectares       |
| `51_100ha`    | 51 a 100 hectares     |
| `acima_100ha` | Acima de 100 hectares |

---

## 6. Tipo de material a distribuir

**Campo:** `tipo_material_distribuir`

| ID                                   | Texto                                |
| ------------------------------------ | ------------------------------------ |
| `apenas_esterco_solido`              | Apenas esterco sólido                |
| `esterco_solido_compostos_organicos` | Esterco sólido e compostos orgânicos |
| `organo_mineral`                     | Organo mineral                       |

---

# Estrutura para o arquivo de recomendações

Cada recomendação deve utilizar os campos abaixo:

```json
{
  "id": "DISTRIBUIDOR-001",
  "equipamento": "distribuidor_esterco",
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "distribuidor_esterco",
    "sistema_predominante": "ID_DO_SISTEMA",
    "tamanho_rebanho_confinado": "ID_DO_REBANHO",
    "potencia_tdp": "ID_DA_POTENCIA",
    "sistema_pesagem": "ID_DA_PESAGEM",
    "area_coberta": "ID_DA_AREA",
    "tipo_material_distribuir": "ID_DO_MATERIAL"
  },
  "resultado": {
    "tipo": "produto",
    "valor": "PRODUTO"
  }
}
```

## Curinga

Quando uma condição puder ser **qualquer valor**, utilize:

```text
*
```

Por exemplo:

```json
"tamanho_rebanho_confinado": "*",
"potencia_tdp": "*",
"sistema_pesagem": "*",
"area_coberta": "*"
```

Isso significa que aquela condição não interfere na recomendação.

---

# Exemplo real

Para uma combinação com:

* Sistema predominante: **Compostagem**
* Rebanho confinado: **201 a 600 animais**
* Potência na TDP: **70 a 85 cv**
* Sistema de pesagem: **Sim**
* Área coberta: **51 a 100 hectares**
* Tipo de material: **Esterco sólido e compostos orgânicos**

A recomendação deve utilizar:

```json
{
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "distribuidor_esterco",
    "sistema_predominante": "compostagem",
    "tamanho_rebanho_confinado": "201_600_animais",
    "potencia_tdp": "70_85cv",
    "sistema_pesagem": "sim",
    "area_coberta": "51_100ha",
    "tipo_material_distribuir": "esterco_solido_compostos_organicos"
  }
}
```

---

# Exemplo utilizando curinga

Se a recomendação for válida independentemente do sistema de pesagem, por exemplo:

* Sistema predominante: **Confinamento**
* Rebanho: **Acima de 600 animais**
* Potência: **86 a 200 cv**
* Sistema de pesagem: **Qualquer**
* Área: **Acima de 100 hectares**
* Material: **Apenas esterco sólido**

Utilize:

```json
{
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "distribuidor_esterco",
    "sistema_predominante": "confinamento",
    "tamanho_rebanho_confinado": "acima_600_animais",
    "potencia_tdp": "86_200cv",
    "sistema_pesagem": "*",
    "area_coberta": "acima_100ha",
    "tipo_material_distribuir": "apenas_esterco_solido"
  }
}
```

---

# Lista completa de IDs

Para facilitar a conferência durante a criação das recomendações:

### `sistema_predominante`

```text
compostagem
confinamento
compostagem_e_confinamento
```

### `tamanho_rebanho_confinado`

```text
ate_200_animais
201_600_animais
acima_600_animais
```

### `potencia_tdp`

```text
ate_70cv
70_85cv
86_200cv
acima_200cv
```

### `sistema_pesagem`

```text
sim
nao
```

### `area_coberta`

```text
ate_50ha
51_100ha
acima_100ha
```

### `tipo_material_distribuir`

```text
apenas_esterco_solido
esterco_solido_compostos_organicos
organo_mineral
```

---

# Regras importantes

> **Não altere os IDs.**

Os IDs precisam ser **idênticos aos definidos no JSON de perguntas**.

Por exemplo:

```text
ate_200_animais
```

é diferente de:

```text
ate_200
```

Da mesma forma:

```text
201_600_animais
```

é diferente de:

```text
201_a_600_animais
```

E:

```text
compostagem_e_confinamento
```

é diferente de:

```text
compostagem_confinamento
```

Também não altere a grafia, acentuação ou estrutura dos IDs.

O sistema utiliza esses valores para fazer a correspondência entre as respostas do formulário e as regras de recomendação.

**Os IDs do arquivo `recomendacoes/distribuidor_esterco.json` devem ser exatamente iguais aos IDs presentes no arquivo `perguntas/distribuidor_esterco.json`.**
