import dicionario from './dicionario.js';

const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const divConfig = document.querySelector('#divConfig');
const divPontos = document.querySelector('#divPontos');
const divDica = document.querySelector('#divDica');

const btnJogar = document.querySelector('#btnJogar');
const btnSair = document.querySelector('#btnSair');
const btnVoltar = document.querySelector('#btnVoltar');
const btnTestar = document.querySelector('#btnTestar');
const btnPlvAleat = document.querySelector('#btnPlvAleat');
const chkDica = document.querySelector('#chkDica');
const slctTema = document.querySelector('#slctTema');
const inputTmpJogo = document.querySelector('#inputTmpJogo');
const inputQntErros = document.querySelector('#inputQntErros');
const chkPiscaFundo = document.querySelector('#chkPiscaFundo');
const allInputs = document.querySelectorAll('.inputs')

const plvSecretaBase = document.querySelector('#plvSecretaBase');
const letra = document.querySelector('#letra');
const lblForca = document.querySelector('#lblForca');
const lblTentativas = document.querySelector('#tentativas');
const lblLetrasErradas = document.querySelector('#lblLetrasErradas');
const lblTempo = document.querySelector('#tempo');
const lblPontos = document.querySelector('#pontos');
const body = document.querySelector('#body');
const dica = document.querySelector('#dica');

let corFundo = '';
let tema = 0;
let qntErros = 1;
let piscarOn = true;
let objPalavra;
let plvSecreta = '';
let letraTeste = '';
let tentativas = 6;
let segredo = [];
let palavra = [];
let erradas = [];
let certas = [];
let pontos = 0;
let tempoIni = 200;
let tempo = tempoIni;
let timer;

const pontosStorage = localStorage.getItem('pontos');
const tempoIniStorage = localStorage.getItem('tempoIni');
const qntErrosStorage = localStorage.getItem('qntErros');
const temaStorage = localStorage.getItem('tema');
const piscaStorage = localStorage.getItem('pisca');

if (pontosStorage !== null) pontos = Number(pontosStorage);
lblPontos.innerHTML = pontos;

if (tempoIniStorage !== null) tempoIni = Number(tempoIniStorage);
inputTmpJogo.value = tempoIni;

if (qntErrosStorage !== null) qntErros = Number(qntErrosStorage);
inputQntErros.value = qntErros;

if (temaStorage !== null) tema = Number(temaStorage);
slctTema.selectedIndex = tema;
seletorTema();

if (piscaStorage !== null) {
    if (piscaStorage === 'false') {
        piscarOn = false;
    } else {
        piscarOn = true;
    }
}   
chkPiscaFundo.checked = piscarOn;

/* 
    Para arrumar:         
    - Ao sair no meio do jogo, mostrar a palavra
    - Otimizar os bonecos
    - Adicionar botão de 'jogar novamente' (mudar o q acontece ao perder/morrer)
    - Deixar a página mais estilizada
    - Otimizar o código
    - tirar a palavra do plvSecretaBase por segurança
*/

/* 
    Feitos (para facilitar versionamento):
    - Adicionado ícone
    - Pisca fundo consertado
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

btnConfig.addEventListener('click', function () {
    divPontos.style.display = 'none';
    divPrincipal.style.display = 'none';
    divConfig.style.display = 'block';
})

btnPlvAleat.addEventListener('click', function palavraAleatoria() {
    objPalavra = dicionario.getPalavra();
    jogar(objPalavra.nome);
});

chkDica.addEventListener('click', function () {
    mostraDica();
});

slctTema.addEventListener('change', function () {
    seletorTema();
});

inputTmpJogo.addEventListener('change', function () {
    tempoIni = inputTmpJogo.value;
    localStorage.setItem('tempoIni', tempoIni);
});

inputQntErros.addEventListener('change', function () {
    qntErros = inputQntErros.value;
    localStorage.setItem('qntErros', qntErros);
});

chkPiscaFundo.addEventListener('change', function () {
    piscarOn = chkPiscaFundo.checked;
    localStorage.setItem('pisca', piscarOn);
});

/* Configura o jogo para começar */
btnJogar.addEventListener('click', function () {
    jogar();
});

/* Botão para voltar ao menu */
btnVoltar.addEventListener('click', function () {
    reset();
});

/* Botão para sair da partida */
btnSair.addEventListener('click', function () {
    reset();
});





function seletorTema() {
    tema = slctTema.selectedIndex;
    localStorage.setItem('tema', tema);

    switch (slctTema.selectedIndex) {
        case 0:
            corFundo = 'rgb(161, 178, 195)';
            body.style.backgroundColor = 'rgb(190, 195, 205)';
            body.style.color = '#000';
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = null;
                allInputs[i].style.color = null;
            }
            break;

        case 1:
            corFundo = 'rgb(49, 50, 51)';
            document.body.style.backgroundColor = 'rgb(49, 50, 51)';
            document.body.style.color = '#eee';
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = '#515253';
                allInputs[i].style.color = '#eee';
            }
            break;
    }
}

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
    divPontos.style.display = 'block';
    divJogo.style.display = null;
    divConfig.style.display = null;
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
                    if (tentativas > 0) mudaCorFundo('#cccc15', 1, body);
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
        setTimeout(ganhou, 3000);
        function ganhou() { alert('Você Ganhou!!!') };
        setTimeout(reset, 3100);
        atualizaPontos(++pontos);
    }
    letra.focus();
}

function perdeu() {
    letra.disabled = true;
    mudaCorFundo('#ff000099', 3, body)
    setTimeout(msg, 3000);
    function msg() { alert('Você perdeu. A palavra secreta era: ' + plvSecreta) };
    setTimeout(reset, 3100);
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
/* A função abaixo retira as marcas do \u0300 (`) até o \u036f ( ͯ ) */
function removeAcento(letra) {
    return letra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function mudaCorFundo(cor, vezes, obj) {
    if (chkPiscaFundo.checked) {
        let contaVezes = 0;
        let corOriginal = corFundo;
        piscar();
        function piscar() {
            if (contaVezes === vezes) { return; }
            if (corOriginal === document.body.style.backgroundColor) {
                document.body.style.backgroundColor = cor;
            } else {
                contaVezes++;
                document.body.style.backgroundColor = corOriginal;
            }
            setTimeout(piscar, 500);
        }
    }
};

function mostraDica() {
    if (tentativas <= qntErros && typeof (objPalavra) !== 'undefined') {
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