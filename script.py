import pandas as pd
import json
import re
from unidecode import unidecode


ARQUIVO_EXCEL = "colhedora_regras.xlsx"
ARQUIVO_JSON = "colhedora_recomendacoes.json"


def normalizar(texto):

    if pd.isna(texto):
        return "*"

    texto = str(texto).strip().lower()

    if texto in [
        "qualquer",
        "qualquer resposta",
        "todos"
    ]:
        return "*"

    texto = unidecode(texto)

    texto = texto.replace(
        " ",
        "_"
    )

    texto = texto.replace(
        "/",
        "_"
    )

    texto = texto.replace(
        "+",
        "_"
    )

    texto = texto.replace(
        "(",
        ""
    )

    texto = texto.replace(
        ")",
        ""
    )

    texto = re.sub(
        r'[^a-z0-9_]',
        '',
        texto
    )

    return texto



df = pd.read_excel(
    ARQUIVO_EXCEL
)


regras = []


for index, linha in df.iterrows():

    regra = {

        "id": f"COLHEDORA-{index+1:03d}",

        "equipamento": "colhedora",

        "criterios": {

            "tipo_gado": normalizar(
                linha["Tipo de Gado"]
            ),

            "equipamento": normalizar(
                linha["Equipamento"]
            ),

            "uso_material": normalizar(
                linha["Principal uso do material colhido"]
            ),

            "tipo_forragem": normalizar(
                linha["Tipo de forragem"]
            ),

            "altura_material": normalizar(
                linha["Altura do material"]
            ),

            "potencia_tdp": normalizar(
                linha["Potência na TDP do trator"]
            ),

            "hectares": normalizar(
                linha["Hectares a colher"]
            )

        },

        "resultado": {

            "tipo": (
                "produto"
                if (
                    not str(linha["Resultado"])
                    .lower()
                    .startswith(
                        "para"
                    )
                    and
                    not str(linha["Resultado"])
                    .lower()
                    .startswith(
                        "a casale"
                    )
                    and
                    not str(linha["Resultado"])
                    .lower()
                    .startswith(
                        "a potencia"
                    )
                )
                else
                "consultor"
            ),

            "valor": str(
                linha["Resultado"]
            ).strip()

        }

    }


    regras.append(
        regra
    )



with open(
    ARQUIVO_JSON,
    "w",
    encoding="utf-8"
) as arquivo:

    json.dump(
        regras,
        arquivo,
        ensure_ascii=False,
        indent=4
    )


print(
    f"Arquivo criado: {ARQUIVO_JSON}"
)

print(
    f"Quantidade de regras: {len(regras)}"
)
