# Guia de IDs — Recomendações do Moedor

> **Regra principal:** os valores abaixo devem ser utilizados **exatamente como estão escritos** no arquivo `recomendacoes/moedor.json`.

---

## 1. O que você pretende moer?

**Campo:** `tipo_material_moer`

| ID             | Texto        |
| -------------- | ------------ |
| `feno`         | Feno         |
| `graos`        | Grãos        |
| `feno_e_graos` | Feno e Grãos |

---

## 2. Toneladas de feno por hora

**Campo:** `toneladas_feno`

| ID                  | Texto                |
| ------------------- | -------------------- |
| `ate_7_ton_hora`    | Até 7 ton/hora       |
| `7_10_ton_hora`     | De 7 a 10 ton/hora   |
| `acima_10_ton_hora` | Acima de 10 ton/hora |

---

## 3. Toneladas de grãos por hora

**Campo:** `toneladas_graos`

| ID                  | Texto                |
| ------------------- | -------------------- |
| `ate_20_ton_hora`   | Até 20 ton/hora      |
| `20_40_ton_hora`    | De 20 a 40 ton/hora  |
| `acima_40_ton_hora` | Acima de 40 ton/hora |

---

## 4. Acionamento da máquina

**Campo:** `acionamento`

| ID               | Texto              |
| ---------------- | ------------------ |
| `trator`         | Com trator         |
| `motor_eletrico` | Com motor elétrico |

---

# Estrutura para o arquivo de recomendações

Cada recomendação deve utilizar os campos abaixo:

```json
{
  "id": "MOEDOR-001",
  "equipamento": "moedor",
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "moedores",
    "tipo_material_moer": "ID_DO_MATERIAL",
    "toneladas_feno": "ID_DAS_TONELADAS_DE_FENO",
    "toneladas_graos": "ID_DAS_TONELADAS_DE_GRAOS",
    "acionamento": "ID_DO_ACIONAMENTO"
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

Por exemplo, caso uma recomendação seja válida independentemente da quantidade de feno:

```json
{
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "moedores",
    "tipo_material_moer": "feno",
    "toneladas_feno": "*",
    "toneladas_graos": "*",
    "acionamento": "trator"
  }
}
```

---

# Exemplo real

Para uma combinação como:

* Feno
* Até 7 ton/hora
* Com trator

A recomendação deve utilizar:

```json
{
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "moedores",
    "tipo_material_moer": "feno",
    "toneladas_feno": "ate_7_ton_hora",
    "toneladas_graos": "*",
    "acionamento": "trator"
  }
}
```

Como a pergunta sobre grãos não é relevante quando o usuário escolhe somente **Feno**, o campo pode utilizar `*`.

---

# Atenção para "Feno e Grãos"

Quando o usuário escolher:

```text
Feno e Grãos
```

o campo deverá receber:

```json
"tipo_material_moer": "feno_e_graos"
```

Nesse cenário, as respostas de **toneladas de feno** e **toneladas de grãos** podem ser utilizadas simultaneamente para encontrar a recomendação.

Exemplo:

```json
{
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "moedores",
    "tipo_material_moer": "feno_e_graos",
    "toneladas_feno": "7_10_ton_hora",
    "toneladas_graos": "20_40_ton_hora",
    "acionamento": "motor_eletrico"
  }
}
```

---

# Importante

Não altere os IDs.

Os IDs precisam ser **idênticos aos definidos no JSON de perguntas**.

Por exemplo:

```text
ate_7_ton_hora
```

é diferente de:

```text
ate_7_ton
```

Da mesma forma:

```text
7_10_ton_hora
```

é diferente de:

```text
7_a_10_ton_hora
```

E:

```text
motor_eletrico
```

é diferente de:

```text
motor_electrico
```

O sistema de recomendação fará a comparação dos valores dos campos. Portanto, qualquer diferença de grafia, acentuação ou estrutura do ID poderá fazer com que uma recomendação não seja encontrada.

## Resumo dos campos

| Campo                | Valores                                                  |
| -------------------- | -------------------------------------------------------- |
| `tipo_material_moer` | `feno`, `graos`, `feno_e_graos`                          |
| `toneladas_feno`     | `ate_7_ton_hora`, `7_10_ton_hora`, `acima_10_ton_hora`   |
| `toneladas_graos`    | `ate_20_ton_hora`, `20_40_ton_hora`, `acima_40_ton_hora` |
| `acionamento`        | `trator`, `motor_eletrico`                               |
| Qualquer valor       | `*`                                                      |
