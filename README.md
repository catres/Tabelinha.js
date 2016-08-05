# Tabelinha.js
Plugin para criação de tabelas responsivas

## Uso

Inicialização simples:

```js
$("tabela").tabelinha();
```

Configurações:

```js
$("tabela").tabelinha({
  //Inicia a exibição no desktop pelo item especificado. Padrão: 0 (índice do primeiro item)
  dtpItemInicial: 0,
  //Inicia a exibição no mobile pelo item especificado. Padrão: 0 (índice do primeiro item)
  mobItemInicial: 0,
  //Número de itens a ser exibido por página no desktop. Padrão: 6
  numItens: 6,
  //Tamanho da tela para trocar a exibição de desktop para mobile. Padrão: 500 (correspondente a 500px de largura)
  minMedia: 500
});
```
