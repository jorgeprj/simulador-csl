# Guia de IDs — Recomendações da Colhedora

> **Regra principal:** os valores abaixo devem ser utilizados **exatamente como estão escritos** no arquivo `recomendacoes/colhedora.json`.

---

## 1. Principal uso do material

**Campo:** `uso_material`

| ID                                    | Texto                                  |
| ------------------------------------- | -------------------------------------- |
| `trato_verde`                         | Trato verde                            |
| `silagem`                             | Silagem                                |
| `trato_verde_silagem`                 | Trato verde e Silagem                  |
| `feno_pre_secada`                     | Feno/Pré-secada                        |
| `trato_verde_silagem_feno_pre_secada` | Trato verde, silagem e feno/pré-secada |
| `milho`                               | Milho                                  |

---

## 2. Tipo de forragem

**Campo:** `tipo_forragem`

| ID                                   | Texto                                  |
| ------------------------------------ | -------------------------------------- |
| `mombaca_braquiaria_tifton_elefante` | Mombaça, Braquiárias, Tifton, Elefante |
| `outros`                             | Outros                                 |

---

## 3. Altura do material

**Campo:** `altura_material`

| ID            | Texto           |
| ------------- | --------------- |
| `ate_40cm`    | Até 40 cm       |
| `41_160cm`    | 41 a 160 cm     |
| `acima_160cm` | Acima de 160 cm |

---

## 4. Potência na TDP

**Campo:** `potencia_tdp`

| ID         | Texto             |
| ---------- | ----------------- |
| `ate_40cv` | Até 40 cv na TDP  |
| `41_50cv`  | 41 a 50 cv na TDP |
| `51_60cv`  | 51 a 60 cv na TDP |
| `61_75cv`  | 61 a 75 cv na TDP |
| `76_85cv`  | 76 a 85 cv na TDP |
| `acima_85cv`  | Acima de 85 cv na TDP |

---

## 5. Hectares

**Campo:** `hectares`

| ID           | Texto                |
| ------------ | -------------------- |
| `ate_30ha`   | Até 30 hectares      |
| `30_60ha`    | 30 a 60 hectares     |
| `acima_60ha` | Acima de 60 hectares |

---

# Estrutura para o arquivo de recomendações

Cada recomendação deve utilizar os campos abaixo:

```json
{
  "id": "COLHEDORA-001",
  "equipamento": "colhedora",
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "colhedora",
    "uso_material": "ID_DO_USO",
    "tipo_forragem": "ID_DA_FORRAGEM",
    "altura_material": "ID_DA_ALTURA",
    "potencia_tdp": "ID_DA_POTENCIA",
    "hectares": "ID_DOS_HECTARES"
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

Exemplo:

```json
"tipo_forragem": "*",
"altura_material": "*",
"potencia_tdp": "*",
"hectares": "*"
```

---

# Exemplo real

Para a combinação:

* Trato verde
* Mombaça, Braquiárias, Tifton, Elefante
* 41 a 160 cm
* 41 a 50 cv na TDP
* Até 30 hectares

A recomendação deve utilizar:

```json
{
  "criterios": {
    "tipo_gado": "*",
    "equipamento": "colhedoras_de_forragem",
    "uso_material": "trato_verde",
    "tipo_forragem": "mombaca_braquiaria_tifton_elefante",
    "altura_material": "41_160cm",
    "potencia_tdp": "41_50cv",
    "hectares": "ate_30ha"
  }
}
```

> **Importante:** não altere os IDs.
> `41_160cm` é diferente de `41_a_160_cm`.
> `ate_30ha` é diferente de `ate_30_hectares`.
> `mombaca_braquiaria_tifton_elefante` é diferente de `mombaca_braquiarias_tifiton_elefante`.

Os IDs precisam ser **idênticos aos definidos no JSON de perguntas**.
