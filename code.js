import dicionario from './dicionario.js';

const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const btnJogar = document.querySelector('#btnJogar');
const btnSair = document.querySelector('#btnSair');
const btnTestar = document.querySelector('#btnTestar');
const btnPlvAleat = document.querySelector('#btnPlvAleat');
const plvSecretaBase = document.querySelector('#plvSecretaBase');
const letra = document.querySelector('#letra');
const lblForca = document.querySelector('#lblForca');
const lblTentativas = document.querySelector('#tentativas');
const lblLetrasErradas = document.querySelector('#lblLetrasErradas');
const lblTempo = document.querySelector('#tempo');
const lblPontos = document.querySelector('#pontos');
const body = document.querySelector('#body');
const divDica = document.querySelector('#divDica');
const dica = document.querySelector('#dica');
const chkDica = document.querySelector('#chkDica');

let objPalavra;
let plvSecreta = '';
let letraTeste = '';
let tentativas = 6;
let segredo = [];
let palavra = [];
let erradas = [];
let certas = [];
let pontos = 0;
const tempoIni = 200;
let tempo = tempoIni;
let timer;
const pontosStorage = localStorage.getItem('pontos');
if (pontosStorage !== null) pontos = Number(pontosStorage);
lblPontos.innerHTML = pontos;

/* 
    Para arrumar:
    - Página de configurações
        - Adicionar Modo Escuro
        - Mudar Tempo até perder
        - Quantidade de erros para dica
        - 
    - Otimizar os bonecos
    - Adicionar botão de 'jogar novamente' (mudar o q acontece ao perder/morrer)
    - Deixar a página mais estilizada
    - Otimizar o código
*/

/* 
    Feitos (para facilitar versionamento):
    - Ao perder a caixa da letra de teste é bloqueada para evitar spamming de letras
    - Não é permitido somente caracteres como palavra
    - Frases muito grandes quebravam as palavras ao meio
    - Mudei os botões e funções de lugar para melhor visualização
*/

divPrincipal.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnJogar.click();
    }
});

divJogo.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnTestar.click();
    }
});

btnPlvAleat.addEventListener('click', function palavraAleatoria() {
    objPalavra = dicionario.getPalavra();
    jogar(objPalavra.nome);
});

chkDica.addEventListener('click', function () {
    mostraDica();
});

/* Configura o jogo para começar */
btnJogar.addEventListener('click', function () {
    jogar();
});

/* Botão para sair da partida */
btnSair.addEventListener('click', function () {
    reset();
});





function jogar(palavra) {
    /* Se receber uma palavra, troca o texto do input 'plvSecretaBase' */
    if (typeof (palavra) === 'string' && palavra !== '') {
        plvSecretaBase.value = palavra;
    }
    let caracPermitidos = /[\u0030-\u0039\u0041-\u005a\u0061-\u007a]/g
    /* Testa se tem alguma coisa escrita */
    if (plvSecretaBase.value !== '' && removeAcento(plvSecretaBase.value).match(caracPermitidos)) {
        divPrincipal.style.display = 'none';
        divJogo.style.display = 'block';
        plvSecreta = plvSecretaBase.value.toUpperCase();
        separarLetras();
        contarEspacos();
        temporizador();
        letra.focus();
    } else {
        alert('Por favor coloque uma palavra');
    }
};

/* Limpa a partida anterior e volta para a tela de escolher a palavra secreta */
function reset() {
    tentativas = 6;
    divPrincipal.style.display = 'block';
    divJogo.style.display = null;
    plvSecretaBase.value = '';
    lblTentativas.innerHTML = tentativas;
    letra.disabled = false;
    plvSecretaBase.focus();
    erradas = [];
    certas = [];
    lblLetrasErradas.innerHTML = '';
    desenharBoneco();
    clearInterval(timer);
    mostraDica();
};

function separarLetras() {
    /* reseta o array para que limpe os dados da outra partida */
    segredo = [];
    palavra = [];

    /* "empurra" as letras para dentro da array EX: 'abacate' vira ['a','b','a','c','a','t','e'] */
    for (let i = 0; i < plvSecreta.length; i++) {
        segredo.push(plvSecreta[i]);
        /* Se a 'palavra' dada tiver espaços (ou seja, é uma frase) colocar espaços para separar */
        if (plvSecreta[i].includes(' ')) {
            palavra.push('\u00a0' + '<wbr>');
        } else {
            if (plvSecreta[i].includes('-')) {
                palavra.push('-');
            } else {
                palavra.push('_');
            }
        }
    }
};

/* Cria os "espaços" que separam cada letra na tela do jogo */
function contarEspacos() {
    let qntdd = '';
    for (let i = 0; i < plvSecreta.length; i++) {
        qntdd += palavra[i] + '&nbsp;';
    }
    lblForca.innerHTML = qntdd;
};

function temporizador() {
    tempo = tempoIni;
    lblTempo.innerHTML = tempo;

    timer = setInterval(contar, 1000);
    function contar() {
        if (tempo > 0 && divJogo.style.display === 'block') {
            tempo--;
            lblTempo.innerHTML = tempo;
        } else {
            if (tempo <= 0) {
                perdeu();
                clearInterval(timer);
            }
        }
    }
};

btnTestar.addEventListener('click',
    function testaLetra() {
        /* Pega o VALOR da variável 'letra', transforma em LETRA MAIUSCULA e manda retirar o acento */
        letraTeste = removeAcento(letra.value.toUpperCase());

        /* Testa se tem nenhuma ou mais de uma letra na caixa de texto */
        if (letra.value.length !== 1) {
            alert('Por favor coloque UMA letra');
        } else {
            if (certas.includes(letraTeste) === false && erradas.includes(letraTeste) === false) {
                let acertou = false;
                /* Muda os '_' por letras */
                for (let i = 0; i < segredo.length; i++) {
                    if (letraTeste === removeAcento(segredo[i])) {
                        palavra[i] = segredo[i];
                        acertou = true;
                    }
                }
                /* Fazer: Pegar o de baixo, transformar em string e depois jogar no html 'lblForca' */
                lblForca.innerHTML = palavra;
                if (acertou === true) {
                    certas.push(letraTeste);
                    acertou = false;
                } else {
                    tentativas--;
                    if (tentativas > 0) mudaCorFundo('#ffff00', 1, body);
                    mostraDica();
                    erradas.push(letraTeste);
                    lblLetrasErradas.innerHTML = erradas;
                    desenharBoneco();
                    if (tentativas === 0) {
                        perdeu();
                    }
                }
                lblForca.innerHTML = lblForca.innerHTML.replaceAll(',', '\u00a0');
                lblTentativas.innerHTML = tentativas;
            } else {
                alert('Você já testou esta letra. Por favor tente outra.');
            }
            testeGanhou();
        }
        letra.value = '';
    }
);

/* Transforma o texto que aparece na tela em algo que o PC pode comparar */
/* Ex: de 'A B A C A T E' para 'ABACATE' e assim ver se completou a palavra*/
function testeGanhou() {
    let forca = lblForca.innerHTML;
    forca = forca.replaceAll(/['&nbsp;' '<wbr>']/g, '');

    let teste = plvSecreta;
    teste = teste.replaceAll(' ', '')

    if (forca === teste && teste !== '') {
        mudaCorFundo('#00ff0077', 2, body)
        setTimeout(ganhou, 2600);
        function ganhou() { alert('Você Ganhou!!!') };
        setTimeout(reset, 2700);
        atualizaPontos(++pontos);
    }
    letra.focus();
}

function perdeu() {
    letra.disabled = true;
    mudaCorFundo('#ff000099', 3, body)
    setTimeout(msg, 2600);
    function msg() { alert('Você perdeu. A palavra secreta era: ' + plvSecreta) };
    setTimeout(reset, 2700);
    clearInterval(timer);
    atualizaPontos(0);
}

/* Quando chamada, ativa o boneco de acordo com a quantid de tentativas e desativa os outros */
function desenharBoneco() {
    const boneco = 6 - tentativas;
    for (let i = 0; i < 7; i++) {
        document.getElementById('boneco' + i).style.display = i === boneco ? 'block' : 'none';
    }
}

/* Recebe uma letra/frase e remove o acento (funciona separando o Unicode do acento do da letra) */
/* Ex: O caractere 'à' ('\u00e0') é a combinação do 'a' ('\u0061') com o acento '`' ('\u0300') */
/* A função abaixo retira as marcas do \u0300 (`) até o \u036f (' ͯ ')*/
function removeAcento(letra) {
    return letra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function mudaCorFundo(cor, vezes, obj) {
    let contaVezes = 0;
    let corOriginal = '';
    piscar();
    function piscar() {
        if (contaVezes === vezes) { return; }
        if (corOriginal === obj.style.backgroundColor) {
            obj.style.backgroundColor = cor;
        } else {
            contaVezes++;
            obj.style.backgroundColor = corOriginal;
        }
        setTimeout(piscar, 500);
    }
};

function mostraDica() {
    if (tentativas < 2 && typeof (objPalavra) !== 'undefined') {
        if (objPalavra.dica !== undefined) {
            divDica.style.display = 'block';
            if (chkDica.checked) {
                dica.innerHTML = objPalavra.dica;
            } else {
                dica.innerHTML = '';
            }
        }
    } else {
        chkDica.checked = false;
        divDica.style.display = '';
    }
};

function atualizaPontos(pontos) {
    localStorage.setItem('pontos', pontos);
    lblPontos.innerHTML = pontos;
};