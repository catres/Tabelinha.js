/*
 * Tabelinha: Um plugin para criar tabelas responsivas e com paginacao mobile
 * MIT License
 * https://github.com/catres
 */
(function($) {
  $.fn.tabelinha = function(options) {
    "use strict"

    var defaults = {
      //Item a ser exibido primeiro no desktop
      dtpItemInicial: 0,
      //Item a ser exibido primeiro no mobile
      mobItemInicial: 0,
      //Numero de itens por pagina
      numItens: 6,
      //Tamanho da tela para iniciar a paginacao mobile
      minMedia: 500
        //ISSUE: altContainer: 285
    };

    var settings = $.extend({}, defaults, options);

    return this.each(function() {

      var $this = $(this);
      var $titulos = $this.find("th");
      var $celulas = $this.find("td");
      var $linhas = $this.find("tbody tr");

      $this.addClass("tabelinha");
      $this.after("<div class='tab-rodape'>\n" +
        "<div class='tab-num-itens'></div>\n" +
        "<div class='tab-paginacao'>\n" +
        "<a class='tab-btn-anterior'></a>\n" +
        "<a class='tab-btn-proximo'></a>\n" +
        "</div>\n" +
        "</div>");

      $celulas.each(function() {
        $(this).html("<b>" + $titulos.eq($(this).index()).html() + "</b> <span>" + $(this).html() + "</span>");
      });

      var $rodape = $this.next();
      var $paginas = $this.next().children(".tab-paginacao");
      var $itens = $this.next().children(".tab-num-itens");

      function verificaBtn() {
        if ($linhas.first().hasClass("visivel")) {
          $paginas.children(".tab-btn-anterior").addClass("btn-inativo");
          $paginas.children(".tab-btn-proximo").removeClass("btn-inativo");
        } else if ($linhas.last().hasClass("visivel")) {
          $paginas.children(".tab-btn-proximo").addClass("btn-inativo");
          $paginas.children(".tab-btn-anterior").removeClass("btn-inativo");
        } else {
          $paginas.children().removeClass("btn-inativo");
        }
      }

      function atualizaPag() {
        var $prim = $this.find(".visivel").index() + 1;
        var $ult = $this.find(".visivel").eq($this.find(".visivel").length - 1).index() + 1;
        $itens.html($linhas.length + " itens (<span class='tab-item-atual'>" + $prim + "</span> at&eacute; <span class='tab-item-final'>" + $ult + "</span>)");
      }

      function anteriorDtp() {
        var $atual = $this.find(".visivel");
        console.log($atual);
        if ($atual.eq(0).prevAll().length < settings.numItens) {
          $linhas.first().nextUntil($linhas.eq(settings.numItens - 1)).addBack().addClass("visivel");
          $linhas.eq(settings.numItens - 1).nextAll().removeClass("visivel");
        } else {
          for (var i = 0; i < settings.numItens; i++) {
            $linhas.eq(($atual.eq(0).index() - i - 1)).addClass("visivel");
            $atual.eq(0).nextUntil($atual.eq(settings.numItens)).addBack().removeClass("visivel");
          }
        }
        atualizaPag();
        verificaBtn();
      }

      function proximoDtp() {
        var $atual = $this.find(".visivel");
        $atual.eq(settings.numItens - 1).removeClass("visivel").nextUntil($linhas.eq($atual.eq(settings.numItens - 1).index() + 1 + settings.numItens)).addClass("visivel");
        $atual.eq(0).nextUntil($atual.eq(settings.numItens - 1)).addBack().removeClass("visivel");
        atualizaPag();
        verificaBtn();
      }

      function anteriorMob() {
        var $atual = $this.find(".visivel");
        $atual.removeClass("visivel");
        if ($atual.is(":first-child")) {
          $linhas.last().addClass("visivel");
          $itens.children(".tab-item-atual").html(($linhas.last().index()) + 1);
        } else {
          $atual.prev().addClass("visivel");
          $itens.children(".tab-item-atual").html(($atual.prev().index()) + 1);
        }
      }

      function proximoMob() {
        var $atual = $this.find(".visivel");
        $atual.removeClass("visivel");
        if ($atual.is(":last-child")) {
          $linhas.first().addClass("visivel");
          $itens.children(".tab-item-atual").html(($linhas.first().index()) + 1);
        } else {
          $atual.next().addClass("visivel");
          $itens.children(".tab-item-atual").html(($atual.next().index()) + 1);
        }
      }

      if (matchMedia) {
        var mq = window.matchMedia("(min-width: " + settings.minMedia + "px)");
        mq.addListener(MudaLargura);
        MudaLargura(mq);
      }

      //Paginacao
      function MudaLargura(mq) {
        //Desktop
        if (mq.matches) {
          //Define a altura da tabela no desktop
          $this.css("height", "");
          $this.addClass("estilo-dtp").removeClass("estilo-mob");
          //Carrega a visualizacao inicial
          $linhas.removeClass("visivel");
          $linhas.eq(settings.dtpItemInicial).addClass("visivel");
          for (var i = 0; i < settings.numItens; i++) {
            $linhas.eq((settings.dtpItemInicial + i)).addClass("visivel");
          }
          atualizaPag();
          verificaBtn();

          if ($linhas.length <= settings.numItens) {
            $rodape.hide();
          }
          $paginas.children(".tab-btn-anterior").off('click', anteriorMob).on('click', anteriorDtp);
          $paginas.children(".tab-btn-proximo").off('click', proximoMob).on('click', proximoDtp);

        }

        //Mobile
        else {
          //Define a altura da tabela no mobile
          $this.css("height", $linhas.height());
          $this.addClass("estilo-mob").removeClass("estilo-dtp");
          //Exibe o rodape, caso nao exista paginacao desktop
          if ($rodape.is(":hidden"))
            $rodape.show();
          if ($paginas.children().hasClass("btn-inativo"))
            $paginas.children().removeClass("btn-inativo");
          //Coloca a visualizacao item especificado nas configuracoes
          $linhas.removeClass("visivel");
          $linhas.eq(settings.mobItemInicial).addClass("visivel");
          $itens.html($linhas.length + " itens (<span class='tab-item-atual'>" + (settings.mobItemInicial + 1) + "</span> de <span class='tab-item-final'>" + $linhas.length + "</span>)");

          $paginas.children(".tab-btn-anterior").off('click', anteriorDtp).on('click', anteriorMob);
          $paginas.children(".tab-btn-proximo").off('click', proximoDtp).on('click', proximoMob);

        }

      } //Fim MudaLargura

      $(window).on('load resize', function() {
        $rodape.css("width", $this.find(".visivel").width());
      });

    });
  };
})(jQuery);