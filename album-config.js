window.albumConfig = {
  // Para personalizar um mês, use sempre o id no formato "AAAA-MM".
  // A foto do mesmo mês deve ficar em imagens/meses/AAAA-MM.jpg, .jpeg, .png ou .webp.
  // Campos por mês:
  // titulo: aparece como nome da página.
  // etiqueta: aparece pequeno acima do título.
  // texto: aparece na página ao lado da foto.
  // legenda: aparece embaixo da foto e no modal ampliado.
  // nota: opcional, troca o texto pequeno no rodapé da página.
  sumario: {
    etiqueta: "Sumário",
    titulo: "O mapa do nosso álbum",
    descricao: "{total} páginas mensais desde o começo da nossa história.",
    rodape: "Cada mês tem um lugar marcado para a lembrança que vai morar ali.",
    indiceEtiqueta: "Meses guardados",
    indiceDescricao: "O calendário vira, e uma página nova aparece para esperar a próxima foto."
  },

  paginaPadrao: {
    nota: "A página existe desde já. A lembrança entra quando a gente escolhe a foto."
  },

  frasesPadrao: [
    "Um mês para guardar no bolso do coração.",
    "A foto escolhida vai contar o que as palavras deixaram brilhando.",
    "Mais uma página para provar que o tempo fica bonito quando passa com você.",
    "Quando essa foto entrar aqui, esse mês ganha casa para sempre.",
    "O amor também mora nos detalhes que a gente escolhe lembrar."
  ],

  meses: {
    "2025-01": {
      titulo: "Primeira fotinha juntos",
      etiqueta: "Comecinho nosso",
      texto: "Antes do nosso dia oficial, janeiro já guardava uma lembrança que merece abrir o álbum.",
      legenda: "Primeira fotinha juntos"
    },

    "2025-02": {
      titulo: "Primeira foto namorando",
      etiqueta: "Agora oficialmente nós",
      texto: "A primeira fotinha depois que a gente começou a namorar de verdade. Fevereiro guardou o friozinho bom do começo, a alegria de chamar de nosso e a certeza de que aquela data tinha virado parte da nossa história.",
      legenda: "Primeira foto depois da conversa com o papis"
    }
  }
};
