import React, { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Base de referência (valores aproximados por 100 g, inspirados em TACO/TBCA)
// "medidas" = medidas caseiras de referência (gramas equivalentes por unidade),
// inspiradas no tipo de equivalência publicada por Sônia Tucunduva Philippi —
// valores aproximados de uso comum, não uma cópia literal da obra.
// ---------------------------------------------------------------------------
const ALIMENTOS = [
  { id: "arroz_branco", nome: "Arroz branco cozido", grupo: "Cereais", kcal: 128, prot: 2.5, carb: 28.1, gord: 0.2, fibra: 1.6, calcio: 4, ferro: 0.1, sodio: 1,
    medidas: [ { label: "colher de sopa", gramas: 25 }, { label: "escumadeira/concha", gramas: 90 }, { label: "xícara de chá", gramas: 150 } ] },
  { id: "arroz_integral", nome: "Arroz integral cozido", grupo: "Cereais", kcal: 124, prot: 2.6, carb: 25.8, gord: 1.0, fibra: 2.7, calcio: 5, ferro: 0.3, sodio: 1,
    medidas: [ { label: "colher de sopa", gramas: 25 }, { label: "escumadeira/concha", gramas: 90 }, { label: "xícara de chá", gramas: 150 } ] },
  { id: "feijao_carioca", nome: "Feijão carioca cozido (com caldo)", grupo: "Leguminosas", kcal: 76, prot: 4.8, carb: 13.6, gord: 0.5, fibra: 8.5, calcio: 27, ferro: 1.3, sodio: 2,
    medidas: [ { label: "concha média", gramas: 80 }, { label: "colher de sopa", gramas: 20 }, { label: "xícara de chá", gramas: 170 } ] },
  { id: "feijao_preto", nome: "Feijão preto cozido (com caldo)", grupo: "Leguminosas", kcal: 77, prot: 4.5, carb: 14.0, gord: 0.5, fibra: 8.4, calcio: 29, ferro: 1.5, sodio: 2,
    medidas: [ { label: "concha média", gramas: 80 }, { label: "colher de sopa", gramas: 20 }, { label: "xícara de chá", gramas: 170 } ] },
  { id: "lentilha", nome: "Lentilha cozida", grupo: "Leguminosas", kcal: 93, prot: 6.3, carb: 16.3, gord: 0.5, fibra: 7.9, calcio: 16, ferro: 1.5, sodio: 2,
    medidas: [ { label: "colher de sopa", gramas: 20 }, { label: "xícara de chá", gramas: 200 } ] },
  { id: "grao_de_bico", nome: "Grão-de-bico cozido", grupo: "Leguminosas", kcal: 121, prot: 6.7, carb: 20.4, gord: 1.7, fibra: 6.3, calcio: 40, ferro: 2.1, sodio: 2,
    medidas: [ { label: "colher de sopa", gramas: 20 }, { label: "xícara de chá", gramas: 180 } ] },
  { id: "ovo", nome: "Ovo de galinha inteiro cozido", grupo: "Ovos e carnes", kcal: 146, prot: 13.3, carb: 0.6, gord: 9.5, fibra: 0, calcio: 42, ferro: 1.8, sodio: 140,
    medidas: [ { label: "unidade média", gramas: 50 }, { label: "unidade grande", gramas: 60 } ] },
  { id: "frango_peito", nome: "Peito de frango grelhado", grupo: "Ovos e carnes", kcal: 159, prot: 32.0, carb: 0, gord: 2.5, fibra: 0, calcio: 4, ferro: 0.4, sodio: 63,
    medidas: [ { label: "filé médio", gramas: 120 }, { label: "fatia", gramas: 30 } ] },
  { id: "carne_bovina", nome: "Carne bovina (patinho) grelhada", grupo: "Ovos e carnes", kcal: 219, prot: 35.9, carb: 0, gord: 7.3, fibra: 0, calcio: 5, ferro: 3.0, sodio: 52,
    medidas: [ { label: "bife médio", gramas: 100 }, { label: "fatia", gramas: 50 } ] },
  { id: "tilapia", nome: "Filé de tilápia grelhado", grupo: "Ovos e carnes", kcal: 128, prot: 26.2, carb: 0, gord: 1.7, fibra: 0, calcio: 10, ferro: 0.4, sodio: 52,
    medidas: [ { label: "filé médio", gramas: 120 } ] },
  { id: "tofu", nome: "Tofu", grupo: "Ovos e carnes", kcal: 76, prot: 8.1, carb: 1.9, gord: 4.8, fibra: 0.5, calcio: 126, ferro: 1.4, sodio: 8,
    medidas: [ { label: "fatia", gramas: 30 }, { label: "pedaço", gramas: 100 } ] },
  { id: "leite_integral", nome: "Leite de vaca integral", grupo: "Laticínios", kcal: 61, prot: 3.2, carb: 4.5, gord: 3.3, fibra: 0, calcio: 113, ferro: 0.1, sodio: 40,
    medidas: [ { label: "copo americano", gramas: 200 }, { label: "xícara de chá", gramas: 240 } ] },
  { id: "iogurte_natural", nome: "Iogurte natural integral", grupo: "Laticínios", kcal: 51, prot: 4.1, carb: 1.9, gord: 3.0, fibra: 0, calcio: 143, ferro: 0.1, sodio: 46,
    medidas: [ { label: "pote individual", gramas: 170 }, { label: "copo", gramas: 200 } ] },
  { id: "queijo_minas", nome: "Queijo minas frescal", grupo: "Laticínios", kcal: 264, prot: 17.4, carb: 3.2, gord: 20.2, fibra: 0, calcio: 579, ferro: 0.4, sodio: 372,
    medidas: [ { label: "fatia", gramas: 30 } ] },
  { id: "queijo_muçarela", nome: "Queijo muçarela", grupo: "Laticínios", kcal: 330, prot: 22.6, carb: 3.0, gord: 25.2, fibra: 0, calcio: 715, ferro: 0.3, sodio: 646,
    medidas: [ { label: "fatia", gramas: 20 } ] },
  { id: "banana", nome: "Banana prata", grupo: "Frutas", kcal: 98, prot: 1.3, carb: 26.0, gord: 0.1, fibra: 2.0, calcio: 8, ferro: 0.3, sodio: 1,
    medidas: [ { label: "unidade média", gramas: 70 } ] },
  { id: "maca", nome: "Maçã com casca", grupo: "Frutas", kcal: 56, prot: 0.3, carb: 15.2, gord: 0.1, fibra: 2.0, calcio: 3, ferro: 0.1, sodio: 1,
    medidas: [ { label: "unidade média", gramas: 130 } ] },
  { id: "laranja", nome: "Laranja pêra", grupo: "Frutas", kcal: 45, prot: 1.0, carb: 11.5, gord: 0.1, fibra: 0.8, calcio: 22, ferro: 0.1, sodio: 1,
    medidas: [ { label: "unidade média", gramas: 180 } ] },
  { id: "mamao", nome: "Mamão papaia", grupo: "Frutas", kcal: 40, prot: 0.5, carb: 10.4, gord: 0.1, fibra: 1.0, calcio: 24, ferro: 0.2, sodio: 3,
    medidas: [ { label: "fatia", gramas: 150 }, { label: "unidade pequena", gramas: 400 } ] },
  { id: "abacate", nome: "Abacate", grupo: "Frutas", kcal: 96, prot: 1.2, carb: 6.0, gord: 8.4, fibra: 6.3, calcio: 8, ferro: 0.2, sodio: 2,
    medidas: [ { label: "colher de sopa", gramas: 15 }, { label: "unidade média", gramas: 200 } ] },
  { id: "manga", nome: "Manga", grupo: "Frutas", kcal: 64, prot: 0.4, carb: 16.7, gord: 0.2, fibra: 1.6, calcio: 5, ferro: 0.1, sodio: 1,
    medidas: [ { label: "unidade média", gramas: 200 } ] },
  { id: "alface", nome: "Alface", grupo: "Verduras e legumes", kcal: 15, prot: 1.4, carb: 2.4, gord: 0.2, fibra: 1.7, calcio: 38, ferro: 0.3, sodio: 5,
    medidas: [ { label: "folha", gramas: 10 }, { label: "xícara picada", gramas: 40 } ] },
  { id: "tomate", nome: "Tomate", grupo: "Verduras e legumes", kcal: 15, prot: 1.1, carb: 3.1, gord: 0.2, fibra: 1.2, calcio: 5, ferro: 0.3, sodio: 4,
    medidas: [ { label: "unidade média", gramas: 90 }, { label: "fatia", gramas: 15 } ] },
  { id: "cenoura", nome: "Cenoura crua", grupo: "Verduras e legumes", kcal: 34, prot: 0.9, carb: 7.7, gord: 0.2, fibra: 3.2, calcio: 23, ferro: 0.3, sodio: 35,
    medidas: [ { label: "unidade média", gramas: 60 }, { label: "colher de sopa ralada", gramas: 15 } ] },
  { id: "brocolis", nome: "Brócolis cozido", grupo: "Verduras e legumes", kcal: 25, prot: 2.1, carb: 4.4, gord: 0.5, fibra: 3.4, calcio: 47, ferro: 0.3, sodio: 8,
    medidas: [ { label: "floreta/ramo", gramas: 15 }, { label: "xícara de chá", gramas: 90 } ] },
  { id: "couve", nome: "Couve refogada", grupo: "Verduras e legumes", kcal: 65, prot: 1.9, carb: 5.0, gord: 4.5, fibra: 2.1, calcio: 115, ferro: 0.5, sodio: 6,
    medidas: [ { label: "colher de sopa", gramas: 15 }, { label: "folha crua", gramas: 20 } ] },
  { id: "abobrinha", nome: "Abobrinha cozida", grupo: "Verduras e legumes", kcal: 19, prot: 1.1, carb: 4.3, gord: 0.2, fibra: 1.3, calcio: 12, ferro: 0.3, sodio: 1,
    medidas: [ { label: "unidade média", gramas: 200 }, { label: "fatia", gramas: 20 } ] },
  { id: "batata_doce", nome: "Batata-doce cozida", grupo: "Verduras e legumes", kcal: 77, prot: 0.6, carb: 18.4, gord: 0.1, fibra: 2.2, calcio: 22, ferro: 0.5, sodio: 5,
    medidas: [ { label: "unidade média", gramas: 130 } ] },
  { id: "batata_inglesa", nome: "Batata inglesa cozida", grupo: "Verduras e legumes", kcal: 52, prot: 1.2, carb: 11.9, gord: 0.1, fibra: 1.3, calcio: 4, ferro: 0.2, sodio: 3,
    medidas: [ { label: "unidade média", gramas: 150 } ] },
  { id: "mandioca", nome: "Mandioca cozida", grupo: "Verduras e legumes", kcal: 125, prot: 0.6, carb: 30.1, gord: 0.3, fibra: 1.6, calcio: 22, ferro: 0.3, sodio: 5,
    medidas: [ { label: "pedaço médio", gramas: 100 } ] },
  { id: "cebola", nome: "Cebola crua", grupo: "Verduras e legumes", kcal: 39, prot: 1.7, carb: 8.9, gord: 0.1, fibra: 2.2, calcio: 15, ferro: 0.3, sodio: 3,
    medidas: [ { label: "unidade média", gramas: 100 }, { label: "colher de sopa picada", gramas: 15 } ] },
  { id: "pepino", nome: "Pepino", grupo: "Verduras e legumes", kcal: 10, prot: 0.9, carb: 1.9, gord: 0.1, fibra: 0.5, calcio: 12, ferro: 0.2, sodio: 2,
    medidas: [ { label: "unidade média", gramas: 150 }, { label: "fatia", gramas: 10 } ] },
  { id: "pao_frances", nome: "Pão francês", grupo: "Cereais", kcal: 300, prot: 8.0, carb: 58.6, gord: 3.1, fibra: 2.3, calcio: 42, ferro: 1.6, sodio: 648,
    medidas: [ { label: "unidade", gramas: 50 } ] },
  { id: "pao_integral", nome: "Pão de forma integral", grupo: "Cereais", kcal: 253, prot: 9.4, carb: 49.9, gord: 3.6, fibra: 6.9, calcio: 130, ferro: 2.5, sodio: 508,
    medidas: [ { label: "fatia", gramas: 25 } ] },
  { id: "aveia", nome: "Aveia em flocos", grupo: "Cereais", kcal: 394, prot: 13.9, carb: 66.6, gord: 8.5, fibra: 9.1, calcio: 48, ferro: 4.4, sodio: 5,
    medidas: [ { label: "colher de sopa", gramas: 10 }, { label: "xícara de chá", gramas: 80 } ] },
  { id: "macarrao", nome: "Macarrão cozido", grupo: "Cereais", kcal: 111, prot: 3.5, carb: 21.6, gord: 0.9, fibra: 1.4, calcio: 7, ferro: 0.4, sodio: 4,
    medidas: [ { label: "escumadeira/concha", gramas: 110 }, { label: "xícara de chá", gramas: 140 } ] },
  { id: "milho_verde", nome: "Milho verde cozido", grupo: "Cereais", kcal: 98, prot: 3.2, carb: 19.0, gord: 1.5, fibra: 2.4, calcio: 2, ferro: 0.2, sodio: 0,
    medidas: [ { label: "colher de sopa", gramas: 20 }, { label: "espiga média", gramas: 90 } ] },
  { id: "castanha_para", nome: "Castanha-do-pará", grupo: "Oleaginosas", kcal: 643, prot: 14.5, carb: 12.3, gord: 63.5, fibra: 7.9, calcio: 146, ferro: 3.4, sodio: 2,
    medidas: [ { label: "unidade", gramas: 5 }, { label: "colher de sopa", gramas: 10 } ] },
  { id: "amendoim", nome: "Amendoim torrado", grupo: "Oleaginosas", kcal: 606, prot: 27.2, carb: 20.3, gord: 43.9, fibra: 8.0, calcio: 92, ferro: 2.3, sodio: 4,
    medidas: [ { label: "colher de sopa", gramas: 15 } ] },
  { id: "castanha_caju", nome: "Castanha-de-caju", grupo: "Oleaginosas", kcal: 570, prot: 18.5, carb: 29.1, gord: 46.3, fibra: 3.7, calcio: 37, ferro: 5.2, sodio: 15,
    medidas: [ { label: "unidade", gramas: 2 }, { label: "colher de sopa", gramas: 10 } ] },
  { id: "azeite", nome: "Azeite de oliva", grupo: "Óleos e gorduras", kcal: 884, prot: 0, carb: 0, gord: 100, fibra: 0, calcio: 0, ferro: 0, sodio: 0,
    medidas: [ { label: "colher de sopa", gramas: 13 }, { label: "colher de chá", gramas: 4 } ] },
  { id: "acucar", nome: "Açúcar cristal", grupo: "Outros", kcal: 387, prot: 0, carb: 99.9, gord: 0, fibra: 0, calcio: 1, ferro: 0.1, sodio: 1,
    medidas: [ { label: "colher de sopa", gramas: 12 }, { label: "colher de chá", gramas: 4 } ] },
  { id: "chia", nome: "Semente de chia", grupo: "Oleaginosas", kcal: 486, prot: 16.5, carb: 42.1, gord: 30.7, fibra: 34.4, calcio: 631, ferro: 7.7, sodio: 16,
    medidas: [ { label: "colher de sopa", gramas: 12 }, { label: "colher de chá", gramas: 4 } ] },
  { id: "linhaca", nome: "Linhaça (semente)", grupo: "Oleaginosas", kcal: 495, prot: 14.1, carb: 28.9, gord: 32.3, fibra: 27.3, calcio: 211, ferro: 5.7, sodio: 30,
    medidas: [ { label: "colher de sopa", gramas: 10 }, { label: "colher de chá", gramas: 3 } ] },
  { id: "cafe", nome: "Café coado (sem açúcar)", grupo: "Outros", kcal: 2, prot: 0.1, carb: 0.4, gord: 0, fibra: 0, calcio: 2, ferro: 0, sodio: 2,
    medidas: [ { label: "xícara de café", gramas: 50 }, { label: "xícara de chá", gramas: 200 }, { label: "copo", gramas: 200 } ] },

  // --- Itens adicionados ---
  { id: "ricota", nome: "Ricota", grupo: "Laticínios", kcal: 155, prot: 11.3, carb: 3.0, gord: 11.0, fibra: 0, calcio: 207, ferro: 0.4, sodio: 84,
    medidas: [ { label: "colher de sopa", gramas: 15 }, { label: "fatia", gramas: 30 } ] },
  { id: "creme_ricota", nome: "Creme de ricota", grupo: "Laticínios", kcal: 180, prot: 8.0, carb: 4.0, gord: 16.0, fibra: 0, calcio: 150, ferro: 0.2, sodio: 300,
    medidas: [ { label: "colher de sopa", gramas: 15 } ] },
  { id: "humus", nome: "Húmus / pasta de grão-de-bico", grupo: "Pastas e molhos", kcal: 166, prot: 7.9, carb: 14.3, gord: 9.6, fibra: 6.0, calcio: 38, ferro: 1.9, sodio: 379,
    medidas: [ { label: "colher de sopa", gramas: 15 } ] },
  { id: "tahine", nome: "Tahine", grupo: "Pastas e molhos", kcal: 595, prot: 17.0, carb: 21.0, gord: 53.8, fibra: 9.3, calcio: 426, ferro: 9.0, sodio: 115,
    medidas: [ { label: "colher de sopa", gramas: 15 }, { label: "colher de chá", gramas: 5 } ] },
  { id: "bolacha_arroz", nome: "Bolacha/biscoito de arroz", grupo: "Cereais", kcal: 390, prot: 8.2, carb: 81.4, gord: 3.0, fibra: 3.5, calcio: 10, ferro: 1.0, sodio: 120,
    medidas: [ { label: "unidade", gramas: 9 } ] },
  { id: "ovo_mexido", nome: "Ovo mexido", grupo: "Ovos e carnes", kcal: 180, prot: 12.5, carb: 1.0, gord: 13.5, fibra: 0, calcio: 45, ferro: 1.7, sodio: 160,
    medidas: [ { label: "unidade (1 ovo)", gramas: 55 }, { label: "porção (2 ovos)", gramas: 110 } ] },
  { id: "pasta_amendoim", nome: "Pasta de amendoim sem açúcar", grupo: "Pastas e molhos", kcal: 588, prot: 25.0, carb: 20.0, gord: 50.0, fibra: 6.0, calcio: 43, ferro: 1.9, sodio: 5,
    medidas: [ { label: "colher de sopa", gramas: 15 }, { label: "colher de chá", gramas: 5 } ] },
  { id: "abacaxi", nome: "Abacaxi", grupo: "Frutas", kcal: 48, prot: 0.9, carb: 12.3, gord: 0.1, fibra: 1.0, calcio: 20, ferro: 0.3, sodio: 1,
    medidas: [ { label: "fatia", gramas: 80 }, { label: "xícara picada", gramas: 165 } ] },
  { id: "kiwi", nome: "Kiwi", grupo: "Frutas", kcal: 51, prot: 1.1, carb: 11.5, gord: 0.5, fibra: 2.1, calcio: 26, ferro: 0.3, sodio: 3,
    medidas: [ { label: "unidade média", gramas: 76 } ] },
  { id: "mel", nome: "Mel", grupo: "Outros", kcal: 309, prot: 0.3, carb: 84.1, gord: 0, fibra: 0.2, calcio: 5, ferro: 0.4, sodio: 4,
    medidas: [ { label: "colher de sopa", gramas: 20 }, { label: "colher de chá", gramas: 7 } ] },
  { id: "pimentao", nome: "Pimentão", grupo: "Verduras e legumes", kcal: 27, prot: 1.1, carb: 6.2, gord: 0.2, fibra: 2.6, calcio: 8, ferro: 0.2, sodio: 2,
    medidas: [ { label: "unidade média", gramas: 160 }, { label: "colher de sopa picado", gramas: 15 } ] },
  { id: "uva", nome: "Uva", grupo: "Frutas", kcal: 53, prot: 0.6, carb: 13.9, gord: 0.3, fibra: 0.9, calcio: 4, ferro: 0.1, sodio: 2,
    medidas: [ { label: "bago", gramas: 5 }, { label: "xícara de chá", gramas: 150 } ] },

  // --- Preparações prontas (valores calculados a partir dos ingredientes da receita, por 100 g do preparo final) ---
  { id: "panqueca_banana", nome: "Panqueca de banana (1 ovo + aveia + banana + canela)", grupo: "Preparações prontas",
    kcal: 130, prot: 7.1, carb: 19.7, gord: 4.2, fibra: 2.6, calcio: 26, ferro: 1.3, sodio: 54,
    medidas: [ { label: "porção (1 panqueca ≈131g)", gramas: 131 } ] },
  { id: "panqueca_maca", nome: "Panqueca de maçã (1 ovo + aveia + maçã + canela)", grupo: "Preparações prontas",
    kcal: 98, prot: 5.4, carb: 14.2, gord: 3.5, fibra: 2.5, calcio: 19, ferro: 1.0, sodio: 44,
    medidas: [ { label: "porção (1 panqueca ≈161g)", gramas: 161 } ] },
  { id: "guacamole", nome: "Guacamole (abacate + tomate + cebola + temperos)", grupo: "Preparações prontas",
    kcal: 61, prot: 1.3, carb: 6.0, gord: 4.2, fibra: 4.0, calcio: 10, ferro: 0.3, sodio: 197,
    medidas: [ { label: "colher de sopa", gramas: 20 }, { label: "porção (receita toda ≈200g)", gramas: 200 } ] },
  { id: "pate_frango", nome: "Patê de frango caseiro (frango + iogurte + temperos)", grupo: "Preparações prontas",
    kcal: 130, prot: 24.7, carb: 0.6, gord: 2.5, fibra: 0.1, calcio: 36, ferro: 0.4, sodio: 58,
    medidas: [ { label: "colher de sopa", gramas: 20 }, { label: "porção (receita toda ≈135g)", gramas: 135 } ] },
  { id: "crepioca", nome: "Crepioca (1 ovo + goma de tapioca)", grupo: "Preparações prontas",
    kcal: 143, prot: 10.2, carb: 8.0, gord: 7.3, fibra: 0, calcio: 33, ferro: 1.4, sodio: 108,
    medidas: [ { label: "porção (1 crepioca ≈65g)", gramas: 65 } ] },
];

const GRUPOS = [...new Set(ALIMENTOS.map((a) => a.grupo))];

const NUTRIENTES = [
  { key: "kcal", label: "Valor energético", unidade: "kcal", casas: 0 },
  { key: "prot", label: "Proteínas", unidade: "g", casas: 1 },
  { key: "carb", label: "Carboidratos", unidade: "g", casas: 1 },
  { key: "gord", label: "Gorduras totais", unidade: "g", casas: 1 },
  { key: "fibra", label: "Fibra alimentar", unidade: "g", casas: 1 },
  { key: "sodio", label: "Sódio", unidade: "mg", casas: 0 },
  { key: "calcio", label: "Cálcio", unidade: "mg", casas: 0 },
  { key: "ferro", label: "Ferro", unidade: "mg", casas: 1 },
];

function formatNum(v, casas) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

function gerarHTMLRelatorio({ porRefeicao, calcularTotais, agruparBlocos, ALIMENTOS, NUTRIENTES, formatNum, porcoes }) {
  const linhaItem = (p) => {
    const alimento = ALIMENTOS.find((a) => a.id === p.id);
    if (!alimento) return "";
    const medida = p.medidaLabel
      ? `${formatNum(p.medidaQtd, p.medidaQtd % 1 === 0 ? 0 : 1)} ${p.medidaLabel} `
      : "";
    return `<div class="linha"><span>${alimento.nome}</span><span class="valor">${medida}(${formatNum(
      p.gramas,
      0
    )} g)</span></div>`;
  };

  const blocosHTML = (itens) =>
    agruparBlocos(itens)
      .map((bloco) => {
        if (bloco.tipo === "unico") return linhaItem(bloco.item);
        return `<div class="bloco-ou">${bloco.itens
          .map((p, idx) => {
            const alimento = ALIMENTOS.find((a) => a.id === p.id);
            if (!alimento) return "";
            const medida = p.medidaLabel
              ? `${formatNum(p.medidaQtd, p.medidaQtd % 1 === 0 ? 0 : 1)} ${p.medidaLabel} `
              : "";
            return `<div class="linha">${idx > 0 ? '<span class="ou">ou</span> ' : ""}<span>${
              alimento.nome
            }</span><span class="valor">${medida}(${formatNum(p.gramas, 0)} g)</span></div>`;
          })
          .join("")}</div>`;
      })
      .join("");

  const refeicoesHTML = porRefeicao
    .map((grupo) => {
      const subtotal = calcularTotais(grupo.itens);
      return `
        <div class="refeicao">
          <div class="refeicao-titulo"><h2>${grupo.nome}</h2><span class="valor">${formatNum(
            subtotal.kcal,
            0
          )} kcal</span></div>
          ${blocosHTML(grupo.itens)}
        </div>`;
    })
    .join("");

  const totais = calcularTotais(porcoes);
  const nutrientesHTML = NUTRIENTES.slice(1)
    .map(
      (n) =>
        `<div class="linha nutriente"><span>${n.label}</span><span class="valor">${formatNum(
          totais[n.key],
          n.casas
        )} ${n.unidade}</span></div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Plano Alimentar</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; background: #EDE7D8; color: #1C2A22; max-width: 760px; margin: 0 auto; padding: 32px; }
  h1 { font-size: 32px; margin-bottom: 4px; }
  h2 { font-size: 22px; margin: 0; }
  .mono { font-family: 'Courier New', monospace; }
  .subtitulo { font-family: 'Courier New', monospace; font-size: 12px; opacity: 0.7; margin-top: 0; }
  .rule-thick { border-top: 8px solid #14181A; margin: 12px 0 20px; }
  .rule-mid { border-top: 3px solid #14181A; margin-top: 8px; padding-top: 6px; }
  .rule-thin { border-top: 1px solid #14181A; }
  .refeicao { margin-bottom: 22px; page-break-inside: avoid; }
  .refeicao-titulo { display: flex; justify-content: space-between; align-items: baseline; border-top: 3px solid #14181A; padding-top: 6px; padding-bottom: 4px; }
  .linha { display: flex; justify-content: space-between; padding: 4px 0; border-top: 1px solid #14181A; font-size: 14px; }
  .linha .valor { font-family: 'Courier New', monospace; opacity: 0.75; white-space: nowrap; margin-left: 12px; }
  .bloco-ou { border-top: 1px solid #14181A; padding: 4px 0; }
  .bloco-ou .linha { border-top: none; padding: 2px 0; }
  .ou { font-family: 'Courier New', monospace; font-size: 10px; text-transform: uppercase; opacity: 0.55; margin-right: 4px; }
  .nutricional { margin-top: 30px; page-break-inside: avoid; }
  .energetico { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #14181A; padding: 8px 0; }
  .nutriente span:first-child { padding-left: 8px; }
  .rodape { font-family: 'Courier New', monospace; font-size: 11px; opacity: 0.6; margin-top: 14px; line-height: 1.4; }
  @media print {
    body { background: #fff; }
  }
</style>
</head>
<body>
  <h1>Plano Alimentar</h1>
  <p class="subtitulo">Gerado em ${new Date().toLocaleDateString("pt-BR")} · base de referência TACO/TBCA e medidas caseiras (Philippi)</p>
  <div class="rule-thick"></div>

  ${refeicoesHTML || '<p class="mono">Nenhuma refeição adicionada ainda.</p>'}

  ${
    porcoes.length > 0
      ? `<div class="nutricional">
          <h2>Informação Nutricional</h2>
          <p class="subtitulo">Total do dia — todas as refeições somadas</p>
          <div class="rule-thick"></div>
          <div class="energetico"><span>Valor energético</span><span class="mono">${formatNum(
            totais.kcal,
            0
          )} kcal</span></div>
          ${nutrientesHTML}
          <p class="rodape">*Valores calculados pela soma proporcional dos alimentos adicionados, com base em tabelas
          de referência (TACO/TBCA) e medidas caseiras de referência (Philippi). Em itens com opções ("ou"), o total
          considera apenas a primeira opção listada — as demais são sugestões de substituição para o paciente escolher.
          Não substitui laudo nutricional oficial.</p>
        </div>`
      : ""
  }

  <script>
    window.onload = function () { window.print(); };
  </script>
</body>
</html>`;
}

const REFEICOES = ["Café da manhã", "Colação", "Almoço", "Lanche da tarde", "Jantar", "Ceia"];

export default function CalculadoraNutricional() {
  const [busca, setBusca] = useState("");
  const [grupoAtivo, setGrupoAtivo] = useState("Todos");
  const [porcoes, setPorcoes] = useState([]); // { uid, id, gramas, medidaLabel, medidaQtd, refeicao, grupoId, ativo }
  // seleção por alimento: { medidaIdx: "livre" | number, qtd: number }
  const [selecao, setSelecao] = useState({});
  const [refeicaoAtiva, setRefeicaoAtiva] = useState(REFEICOES[0]);
  const [visualizar, setVisualizar] = useState("Dia inteiro"); // "Dia inteiro" | nome da refeição
  const [altAberto, setAltAberto] = useState(null); // uid do item para o qual o painel "+ ou" está aberto
  const [altAlimentoId, setAltAlimentoId] = useState("");
  const [altGramas, setAltGramas] = useState(100);

  function gerarUid() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  const alimentosFiltrados = useMemo(() => {
    return ALIMENTOS.filter((a) => {
      const bateGrupo = grupoAtivo === "Todos" || a.grupo === grupoAtivo;
      const bateBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
      return bateGrupo && bateBusca;
    });
  }, [busca, grupoAtivo]);

  function getSelecao(alimento) {
    return selecao[alimento.id] || { medidaIdx: "livre", qtd: alimento.medidas?.length ? 1 : 100 };
  }

  function setMedidaIdx(alimento, medidaIdx) {
    setSelecao((prev) => {
      const atual = getSelecao(alimento);
      const qtdPadrao = medidaIdx === "livre" ? 100 : 1;
      return { ...prev, [alimento.id]: { ...atual, medidaIdx, qtd: qtdPadrao } };
    });
  }

  function setQtd(alimento, qtd) {
    setSelecao((prev) => {
      const atual = getSelecao(alimento);
      return { ...prev, [alimento.id]: { ...atual, qtd } };
    });
  }

  function gramasCalculadas(alimento) {
    const sel = getSelecao(alimento);
    if (sel.medidaIdx === "livre") return sel.qtd || 0;
    const medida = alimento.medidas[sel.medidaIdx];
    return medida ? medida.gramas * (sel.qtd || 0) : 0;
  }

  function rotuloMedida(alimento) {
    const sel = getSelecao(alimento);
    if (sel.medidaIdx === "livre") return null;
    const medida = alimento.medidas[sel.medidaIdx];
    return medida ? medida.label : null;
  }

  function adicionar(alimento) {
    const g = gramasCalculadas(alimento);
    if (!g) return;
    const label = rotuloMedida(alimento);
    const sel = getSelecao(alimento);
    setPorcoes((prev) => {
      const existente = prev.find((p) => p.id === alimento.id && p.refeicao === refeicaoAtiva && !p.grupoId);
      if (existente) {
        // ao somar com um item avulso já existente na mesma refeição, a medida deixa de valer para o total
        return prev.map((p) =>
          p.uid === existente.uid ? { ...p, gramas: p.gramas + g, medidaLabel: null, medidaQtd: null } : p
        );
      }
      return [
        ...prev,
        {
          uid: gerarUid(),
          id: alimento.id,
          gramas: g,
          medidaLabel: label,
          medidaQtd: label ? sel.qtd : null,
          refeicao: refeicaoAtiva,
          grupoId: null,
          ativo: true,
        },
      ];
    });
  }

  function atualizarGramas(uid, gramas) {
    setPorcoes((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, gramas: Math.max(0, gramas), medidaLabel: null, medidaQtd: null } : p))
    );
  }

  function remover(uid) {
    setPorcoes((prev) => {
      const alvo = prev.find((p) => p.uid === uid);
      let resto = prev.filter((p) => p.uid !== uid);
      // se sobrar só 1 item de um grupo, ele volta a ser um item avulso (ativo)
      if (alvo?.grupoId) {
        const restantes = resto.filter((p) => p.grupoId === alvo.grupoId);
        if (restantes.length === 1) {
          resto = resto.map((p) => (p.uid === restantes[0].uid ? { ...p, grupoId: null, ativo: true } : p));
        }
      }
      return resto;
    });
  }

  function abrirAlternativa(item) {
    setAltAberto(item.uid);
    setAltAlimentoId("");
    setAltGramas(100);
  }

  function confirmarAlternativa(item) {
    if (!altAlimentoId || !altGramas) return;
    const grupoId = item.grupoId || gerarUid();
    setPorcoes((prev) => {
      const marcado = prev.map((p) => (p.uid === item.uid ? { ...p, grupoId, ativo: true } : p));
      return [
        ...marcado,
        {
          uid: gerarUid(),
          id: altAlimentoId,
          gramas: altGramas,
          medidaLabel: null,
          medidaQtd: null,
          refeicao: item.refeicao,
          grupoId,
          ativo: false,
        },
      ];
    });
    setAltAberto(null);
  }

  
  function calcularTotais(lista) {
    const acc = { kcal: 0, prot: 0, carb: 0, gord: 0, fibra: 0, sodio: 0, calcio: 0, ferro: 0 };
    lista.forEach((p) => {
      if (p.ativo === false) return; // alternativa não escolhida não entra na soma
      const alimento = ALIMENTOS.find((a) => a.id === p.id);
      if (!alimento) return;
      const fator = p.gramas / 100;
      NUTRIENTES.forEach((n) => {
        acc[n.key] += alimento[n.key] * fator;
      });
    });
    return acc;
  }

  const porcoesFiltradas = useMemo(() => {
    if (visualizar === "Dia inteiro") return porcoes;
    return porcoes.filter((p) => p.refeicao === visualizar);
  }, [porcoes, visualizar]);

  const totais = useMemo(() => calcularTotais(porcoesFiltradas), [porcoesFiltradas]);
  const pesoTotal = porcoesFiltradas.filter((p) => p.ativo !== false).reduce((s, p) => s + p.gramas, 0);

  const porRefeicao = useMemo(() => {
    return REFEICOES.map((r) => ({
      nome: r,
      itens: porcoes.filter((p) => p.refeicao === r),
    })).filter((r) => r.itens.length > 0);
  }, [porcoes]);

  function agruparBlocos(itens) {
    const blocos = [];
    const vistos = new Set();
    itens.forEach((p) => {
      if (p.grupoId) {
        if (vistos.has(p.grupoId)) return;
        vistos.add(p.grupoId);
        blocos.push({ tipo: "grupo", grupoId: p.grupoId, itens: itens.filter((x) => x.grupoId === p.grupoId) });
      } else {
        blocos.push({ tipo: "unico", item: p });
      }
    });
    return blocos;
  }

  return (
    <div
      style={{
        "--paper": "#EDE7D8",
        "--paper-dark": "#E2DAC5",
        "--ink": "#1C2A22",
        "--rule": "#14181A",
        "--mostarda": "#B8862E",
        "--argila": "#A8462B",
        "--verde": "#3C5F45",
        "--azul": "#2F5B6B",
        background: "var(--paper)",
        color: "var(--ink)",
        minHeight: "100%",
        fontFamily: "'Iowan Old Style','Georgia',serif",
      }}
      className="w-full min-h-screen p-4 md:p-8"
    >
      <style>{`
        .mono { font-family: 'Courier New', ui-monospace, monospace; }
        .rule-thick { border-top: 8px solid var(--rule); }
        .rule-thin { border-top: 1px solid var(--rule); }
        .rule-mid { border-top: 3px solid var(--rule); }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        .food-row:hover { background: var(--paper-dark); }
        ::selection { background: var(--mostarda); color: var(--paper); }
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body, .print-bg { background: #fff !important; }
        }
      `}</style>

      {/* Cabeçalho */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <p className="mono text-xs tracking-[0.3em] uppercase" style={{ color: "var(--verde)" }}>
              Ficha de composição de alimentos
            </p>
            <h1 className="text-4xl md:text-5xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              Caderno Nutricional
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => {
                const html = gerarHTMLRelatorio({
                  porRefeicao,
                  calcularTotais,
                  agruparBlocos,
                  ALIMENTOS,
                  NUTRIENTES,
                  formatNum,
                  porcoes,
                });
                const blob = new Blob([html], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "plano-alimentar.html";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 2000);
              }}
              className="no-print mono text-xs uppercase px-4 py-2 font-bold"
              style={{ background: "var(--argila)", color: "var(--paper)" }}
            >
              Baixar relatório (PDF)
            </button>
            <p className="mono text-xs max-w-xs text-right opacity-70">
              valores por 100&nbsp;g (TACO/TBCA) e medidas caseiras de referência (Philippi) — estimativas não oficiais
            </p>
          </div>
        </div>
        <div className="rule-thick mt-3" />
      </header>

      <main className="no-print max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-8">
        {/* Coluna de busca e catálogo */}
        <section>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="mono text-xs uppercase tracking-wider opacity-70">Adicionar em:</span>
            <div className="flex flex-wrap gap-1.5">
              {REFEICOES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRefeicaoAtiva(r)}
                  className="mono text-xs px-2.5 py-1 uppercase"
                  style={
                    refeicaoAtiva === r
                      ? { background: "var(--verde)", color: "var(--paper)" }
                      : { border: "1px solid var(--ink)", opacity: 0.7 }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar alimento — ex: ovo, arroz, banana…"
              className="flex-1 px-3 py-2 bg-transparent rule-mid focus:outline-none focus:ring-2"
              style={{ borderTop: "none", borderBottom: "2px solid var(--ink)" }}
            />
            <select
              value={grupoAtivo}
              onChange={(e) => setGrupoAtivo(e.target.value)}
              className="mono text-sm px-2 py-2 bg-transparent"
              style={{ borderBottom: "2px solid var(--ink)" }}
            >
              <option>Todos</option>
              {GRUPOS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="rule-mid" />
          <ul>
            {alimentosFiltrados.map((a) => {
              const sel = getSelecao(a);
              const gramasPrevistas = gramasCalculadas(a);
              return (
                <li key={a.id} className="food-row rule-thin py-2.5 flex flex-wrap items-center gap-2">
                  <div className="flex-1 min-w-[140px]">
                    <p className="font-semibold truncate">{a.nome}</p>
                    <p className="mono text-xs opacity-60">
                      {a.grupo} · {a.kcal} kcal /100g{gramasPrevistas ? ` · ≈ ${formatNum(gramasPrevistas, 0)} g` : ""}
                    </p>
                  </div>

                  {a.medidas && a.medidas.length > 0 && (
                    <select
                      value={sel.medidaIdx}
                      onChange={(e) => {
                        const v = e.target.value;
                        setMedidaIdx(a, v === "livre" ? "livre" : Number(v));
                      }}
                      className="mono text-xs px-1 py-1 bg-transparent"
                      style={{ borderBottom: "1px solid var(--ink)" }}
                    >
                      {a.medidas.map((m, idx) => (
                        <option key={idx} value={idx}>
                          {m.label} ({m.gramas} g)
                        </option>
                      ))}
                      <option value="livre">gramas (livre)</option>
                    </select>
                  )}

                  <input
                    type="number"
                    min="0"
                    step={sel.medidaIdx === "livre" ? 1 : 0.5}
                    value={sel.qtd}
                    onChange={(e) => setQtd(a, parseFloat(e.target.value) || 0)}
                    className="w-14 mono text-sm px-1 py-1 bg-transparent text-right"
                    style={{ borderBottom: "1px solid var(--ink)" }}
                  />
                  <span className="mono text-xs opacity-60">{sel.medidaIdx === "livre" ? "g" : "×"}</span>

                  <button
                    onClick={() => adicionar(a)}
                    className="mono text-xs uppercase px-3 py-1.5 font-bold"
                    style={{ background: "var(--verde)", color: "var(--paper)" }}
                  >
                    + Add
                  </button>
                </li>
              );
            })}
            {alimentosFiltrados.length === 0 && (
              <li className="py-6 text-center opacity-60 mono text-sm">
                Nenhum alimento encontrado para "{busca}".
              </li>
            )}
          </ul>
        </section>

        {/* Coluna do rótulo nutricional agregado */}
        <aside>
          <div className="sticky top-4">
            <div style={{ border: "2px solid var(--rule)", background: "var(--paper)" }} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold leading-none">Informação Nutricional</h2>
                <select
                  value={visualizar}
                  onChange={(e) => setVisualizar(e.target.value)}
                  className="mono text-xs px-1 py-1 bg-transparent"
                  style={{ borderBottom: "1px solid var(--ink)" }}
                >
                  <option>Dia inteiro</option>
                  {REFEICOES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <p className="mono text-xs mt-1 opacity-70">
                {visualizar === "Dia inteiro" ? "Total do dia" : visualizar}: {formatNum(pesoTotal, 0)} g em{" "}
                {porcoesFiltradas.length} {porcoesFiltradas.length === 1 ? "item" : "itens"}
              </p>

              <div className="rule-thick mt-2" />

              {porcoesFiltradas.length === 0 ? (
                <p className="mono text-sm py-6 text-center opacity-60">
                  {visualizar === "Dia inteiro"
                    ? "Adicione alimentos ao lado para montar seu dia."
                    : `Nenhum item adicionado em ${visualizar} ainda.`}
                </p>
              ) : (
                <>
                  <div className="flex justify-between items-baseline py-2 rule-thin">
                    <span className="font-bold text-lg">Valor energético</span>
                    <span className="mono font-bold text-lg">{formatNum(totais.kcal, 0)} kcal</span>
                  </div>
                  {NUTRIENTES.slice(1).map((n) => (
                    <div key={n.key} className="flex justify-between items-baseline py-1.5 rule-thin">
                      <span className="pl-2">{n.label}</span>
                      <span className="mono">
                        {formatNum(totais[n.key], n.casas)} {n.unidade}
                      </span>
                    </div>
                  ))}
                  <div className="rule-mid mt-2 pt-3">
                    <p className="mono text-[11px] opacity-60 leading-snug">
                      *Valores calculados pela soma proporcional dos alimentos adicionados, com base em
                      tabelas de referência (TACO/TBCA) e medidas caseiras de referência (Philippi).
                      Em itens com opções ("ou"), o total considera apenas a primeira opção listada —
                      as demais são só sugestões de substituição para o paciente escolher.
                      Não substitui laudo nutricional oficial.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Lista de itens adicionados, agrupada por refeição */}
            {porRefeicao.length > 0 && (
              <div className="mt-6 space-y-5">
                {porRefeicao.map((grupo) => {
                  const subtotal = calcularTotais(grupo.itens);
                  return (
                    <div key={grupo.nome}>
                      <div className="flex items-baseline justify-between rule-mid pt-2 pb-1">
                        <p className="mono text-xs uppercase tracking-wider" style={{ color: "var(--argila)" }}>
                          {grupo.nome}
                        </p>
                        <p className="mono text-xs opacity-60">{formatNum(subtotal.kcal, 0)} kcal</p>
                      </div>
                      <ul>
                        {agruparBlocos(grupo.itens).map((bloco) => {
                          if (bloco.tipo === "unico") {
                            const p = bloco.item;
                            const alimento = ALIMENTOS.find((a) => a.id === p.id);
                            if (!alimento) return null;
                            return (
                              <li key={p.uid} className="py-1.5 rule-thin">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm">{alimento.nome}</p>
                                    <p className="mono text-[10px] opacity-50">
                                      {p.medidaLabel
                                        ? `${formatNum(p.medidaQtd, p.medidaQtd % 1 === 0 ? 0 : 1)} ${p.medidaLabel}`
                                        : "gramas (livre)"}
                                    </p>
                                  </div>
                                  <input
                                    type="number"
                                    min="0"
                                    value={p.gramas}
                                    onChange={(e) => atualizarGramas(p.uid, parseFloat(e.target.value) || 0)}
                                    className="w-16 mono text-sm px-1 text-right bg-transparent"
                                    style={{ borderBottom: "1px solid var(--ink)" }}
                                  />
                                  <span className="mono text-xs opacity-60">g</span>
                                  <button
                                    onClick={() => abrirAlternativa(p)}
                                    className="mono text-[10px] px-1.5 py-1"
                                    style={{ color: "var(--azul)" }}
                                    title="Adicionar alimento alternativo (ou)"
                                  >
                                    + ou
                                  </button>
                                  <button
                                    onClick={() => remover(p.uid)}
                                    className="mono text-xs px-2 py-1"
                                    style={{ color: "var(--argila)" }}
                                    aria-label={`Remover ${alimento.nome}`}
                                  >
                                    ×
                                  </button>
                                </div>
                                {altAberto === p.uid && (
                                  <div className="flex items-center gap-2 mt-1.5 pl-3" style={{ borderLeft: "2px solid var(--azul)" }}>
                                    <select
                                      value={altAlimentoId}
                                      onChange={(e) => setAltAlimentoId(e.target.value)}
                                      className="mono text-xs px-1 py-1 bg-transparent flex-1"
                                      style={{ borderBottom: "1px solid var(--ink)" }}
                                    >
                                      <option value="">escolha a alternativa…</option>
                                      {ALIMENTOS.filter((a) => a.id !== p.id).map((a) => (
                                        <option key={a.id} value={a.id}>
                                          {a.nome}
                                        </option>
                                      ))}
                                    </select>
                                    <input
                                      type="number"
                                      min="0"
                                      value={altGramas}
                                      onChange={(e) => setAltGramas(parseFloat(e.target.value) || 0)}
                                      className="w-14 mono text-xs px-1 py-1 bg-transparent text-right"
                                      style={{ borderBottom: "1px solid var(--ink)" }}
                                    />
                                    <span className="mono text-xs opacity-60">g</span>
                                    <button
                                      onClick={() => confirmarAlternativa(p)}
                                      className="mono text-[10px] uppercase px-2 py-1 font-bold"
                                      style={{ background: "var(--azul)", color: "var(--paper)" }}
                                    >
                                      Ok
                                    </button>
                                    <button
                                      onClick={() => setAltAberto(null)}
                                      className="mono text-[10px] px-1 opacity-60"
                                    >
                                      cancelar
                                    </button>
                                  </div>
                                )}
                              </li>
                            );
                          }

                          // bloco de alternativas ("ou") — apenas opções apresentadas, sem seleção no app
                          return (
                            <li key={bloco.grupoId} className="py-1.5 rule-thin">
                              {bloco.itens.map((p, idx) => {
                                const alimento = ALIMENTOS.find((a) => a.id === p.id);
                                if (!alimento) return null;
                                return (
                                  <div key={p.uid}>
                                    {idx > 0 && (
                                      <p className="mono text-[10px] uppercase opacity-50 pl-2 pt-0.5">ou</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm">{alimento.nome}</p>
                                        <p className="mono text-[10px] opacity-50">
                                          {p.medidaLabel
                                            ? `${formatNum(p.medidaQtd, p.medidaQtd % 1 === 0 ? 0 : 1)} ${p.medidaLabel}`
                                            : "gramas (livre)"}
                                        </p>
                                      </div>
                                      <input
                                        type="number"
                                        min="0"
                                        value={p.gramas}
                                        onChange={(e) => atualizarGramas(p.uid, parseFloat(e.target.value) || 0)}
                                        className="w-16 mono text-sm px-1 text-right bg-transparent"
                                        style={{ borderBottom: "1px solid var(--ink)" }}
                                      />
                                      <span className="mono text-xs opacity-60">g</span>
                                      <button
                                        onClick={() => remover(p.uid)}
                                        className="mono text-xs px-2 py-1"
                                        style={{ color: "var(--argila)" }}
                                        aria-label={`Remover ${alimento.nome}`}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                              <button
                                onClick={() => abrirAlternativa(bloco.itens[0])}
                                className="mono text-[10px] px-1.5 py-1 mt-1 ml-6"
                                style={{ color: "var(--azul)" }}
                              >
                                + outra opção
                              </button>
                              {altAberto === bloco.itens[0].uid && (
                                <div className="flex items-center gap-2 mt-1.5 pl-6" style={{ borderLeft: "2px solid var(--azul)" }}>
                                  <select
                                    value={altAlimentoId}
                                    onChange={(e) => setAltAlimentoId(e.target.value)}
                                    className="mono text-xs px-1 py-1 bg-transparent flex-1"
                                    style={{ borderBottom: "1px solid var(--ink)" }}
                                  >
                                    <option value="">escolha a alternativa…</option>
                                    {ALIMENTOS.map((a) => (
                                      <option key={a.id} value={a.id}>
                                        {a.nome}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="number"
                                    min="0"
                                    value={altGramas}
                                    onChange={(e) => setAltGramas(parseFloat(e.target.value) || 0)}
                                    className="w-14 mono text-xs px-1 py-1 bg-transparent text-right"
                                    style={{ borderBottom: "1px solid var(--ink)" }}
                                  />
                                  <span className="mono text-xs opacity-60">g</span>
                                  <button
                                    onClick={() => confirmarAlternativa(bloco.itens[0])}
                                    className="mono text-[10px] uppercase px-2 py-1 font-bold"
                                    style={{ background: "var(--azul)", color: "var(--paper)" }}
                                  >
                                    Ok
                                  </button>
                                  <button onClick={() => setAltAberto(null)} className="mono text-[10px] px-1 opacity-60">
                                    cancelar
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Relatório apenas para impressão/PDF */}
      <div className="print-only max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
          Plano Alimentar
        </h1>
        <p className="mono text-xs opacity-70 mt-1">
          Gerado em {new Date().toLocaleDateString("pt-BR")} · base de referência TACO/TBCA e medidas caseiras (Philippi)
        </p>
        <div className="rule-thick mt-3 mb-4" />

        {porRefeicao.length === 0 && (
          <p className="mono text-sm opacity-60">Nenhuma refeição adicionada ainda.</p>
        )}

        {porRefeicao.map((grupo) => {
          const subtotal = calcularTotais(grupo.itens);
          return (
            <div key={grupo.nome} className="mb-6" style={{ breakInside: "avoid" }}>
              <div className="flex items-baseline justify-between rule-mid pt-2 pb-1">
                <h2 className="text-xl font-bold">{grupo.nome}</h2>
                <span className="mono text-xs opacity-70">{formatNum(subtotal.kcal, 0)} kcal</span>
              </div>
              <ul>
                {agruparBlocos(grupo.itens).map((bloco) => {
                  if (bloco.tipo === "unico") {
                    const p = bloco.item;
                    const alimento = ALIMENTOS.find((a) => a.id === p.id);
                    if (!alimento) return null;
                    return (
                      <li key={p.uid} className="flex justify-between py-1 rule-thin text-sm">
                        <span>{alimento.nome}</span>
                        <span className="mono opacity-70">
                          {p.medidaLabel
                            ? `${formatNum(p.medidaQtd, p.medidaQtd % 1 === 0 ? 0 : 1)} ${p.medidaLabel} `
                            : ""}
                          ({formatNum(p.gramas, 0)} g)
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={bloco.grupoId} className="py-1 rule-thin text-sm">
                      {bloco.itens.map((p, idx) => {
                        const alimento = ALIMENTOS.find((a) => a.id === p.id);
                        if (!alimento) return null;
                        return (
                          <div key={p.uid} className="flex justify-between">
                            <span>
                              {idx > 0 && <span className="opacity-60">ou </span>}
                              {alimento.nome}
                            </span>
                            <span className="mono opacity-70">
                              {p.medidaLabel
                                ? `${formatNum(p.medidaQtd, p.medidaQtd % 1 === 0 ? 0 : 1)} ${p.medidaLabel} `
                                : ""}
                              ({formatNum(p.gramas, 0)} g)
                            </span>
                          </div>
                        );
                      })}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Informação Nutricional do dia inteiro, ao final da página */}
        {porcoes.length > 0 && (
          <div className="mt-8" style={{ breakInside: "avoid" }}>
            <h2 className="text-2xl font-bold">Informação Nutricional</h2>
            <p className="mono text-xs opacity-70 mb-1">Total do dia — todas as refeições somadas</p>
            <div className="rule-thick" />
            <div className="flex justify-between items-baseline py-2 rule-thin">
              <span className="font-bold text-lg">Valor energético</span>
              <span className="mono font-bold text-lg">
                {formatNum(calcularTotais(porcoes).kcal, 0)} kcal
              </span>
            </div>
            {NUTRIENTES.slice(1).map((n) => (
              <div key={n.key} className="flex justify-between items-baseline py-1.5 rule-thin">
                <span className="pl-2">{n.label}</span>
                <span className="mono">
                  {formatNum(calcularTotais(porcoes)[n.key], n.casas)} {n.unidade}
                </span>
              </div>
            ))}
            <p className="mono text-[11px] opacity-60 leading-snug mt-3">
              *Valores calculados pela soma proporcional dos alimentos adicionados, com base em tabelas de
              referência (TACO/TBCA) e medidas caseiras de referência (Philippi). Em itens com opções
              ("ou"), o total considera apenas a primeira opção listada — as demais são sugestões de
              substituição para o paciente escolher. Não substitui laudo nutricional oficial.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
