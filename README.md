# Album Neneca & Neneco

Site-presente com contador do tempo juntos, album mensal em formato de livro e cartao 10x15 cm para imprimir com QR code.

## Como adicionar fotos

- Fotos do album: coloque em `imagens/meses/AAAA-MM.extensao`, por exemplo `imagens/meses/2026-06.jpg`.
- O nome sempre usa ano com 4 digitos e mes com 2 digitos: janeiro de 2025 fica `2025-01`, fevereiro de 2025 fica `2025-02`.
- Extensoes aceitas no album: `.jpg`, `.jpeg`, `.png` e `.webp`.
- Foto do cartao impresso: `imagens/cartao-foto.jpg`, `.jpeg`, `.png` ou `.webp`.
- QR code do cartao impresso: `imagens/qr-code.png`, `.jpg`, `.jpeg` ou `.webp`.
- O cartao de impressao esta no tamanho 5,8 x 8,5 cm.

## Como mudar textos das paginas do album

Edite o arquivo `album-config.js`.

Para cada mes, use o id `AAAA-MM` dentro de `meses`:

```js
"2025-02": {
  titulo: "Nome da pagina",
  etiqueta: "Texto pequeno acima do titulo",
  texto: "Descricao que aparece na pagina ao lado da foto.",
  legenda: "Legenda embaixo da foto"
}
```

O site cria uma pagina nova automaticamente quando entra um novo mes.
