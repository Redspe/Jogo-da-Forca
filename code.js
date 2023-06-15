import dicionario from './dicionario.js';

const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const divPerdeu = document.querySelector('#divPerdeu');
const divConfig = document.querySelector('#divConfig');
const divPontos = document.querySelector('#divPontos');
const divDica = document.querySelector('#divDica');

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
const lblPerdeu = document.querySelector('#lblPerdeu');
const dica = document.querySelector('#dica');
const body = document.querySelector('#body');
const footer = document.querySelector('#footer');

let corFundo = '';
let tema = 1;
let temaCustom = [];
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
const temaCustomStorage = localStorage.getItem('temaCustom');
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

/* Um array com as configurações do tema customizado */
/* if (temaCustomStorage !== null) temaCustom = temaCustomStorage;
console.log(typeof(temaCustom));
seletorTema();
 */
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
    - Consertar o padding do dica (o q deixa ele p baixo)
    - Ao ganhar aparecer tela tbm
    - Otimizar o código
        - Criar 'trocaExibicao' para trocar as páginas
    - Otimizar os bonecos
    - Otimizar os bonecos
    - Adicionar botão de 'jogar novamente' (mudar o q acontece ao perder/morrer)
        - Otimizar os bonecos
    - Adicionar botão de 'jogar novamente' (mudar o q acontece ao perder/morrer)
    - Deixar a página mais estilizada
    - Comentar o código
*/

/* 
    Feitos (para facilitar versionamento):
    - Adicionado Temas customizáveis
    - Bug pontos em sequencia voltavam ao ganhar novamente após perder
    - Página após perder/ganhar o jogo
        - Adicionar botão de 'jogar novamente'
    - Limitar quantidade de tentativas até dica
    - Definir modo Escuro como padrão
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
    btnConfig.style.display = 'none';
    btnVoltar.style.display = null;
    divPontos.style.display = 'none';
    divPrincipal.style.display = 'none';
    divConfig.style.display = 'block';
});

btnCorFundo.addEventListener('click',
    function () {
        dropdown(tdCorFundo);
    }
);

btnCorTexto.addEventListener('click',
    function () {
        dropdown(tdCorTexto);
    }
);

btnCorBotao.addEventListener('click',
    function () {
        dropdown(tdCorBotao);
    }
);

btnAplicar.addEventListener('click', function () {
    seletorTema();
});

btnPlvAleat.addEventListener('click', function () {
    palavraAleatoria();
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

btnJogarDnv.addEventListener('click', function () {
    reset();
    palavraAleatoria();
});

/* Botão para voltar ao menu */
btnVoltar.addEventListener('click', function () {
    if (inputQntErros.value >= 0 && inputQntErros.value <= 5) {
        trDica.style.backgroundColor = null;
    } else {
        trDica.style.backgroundColor = 'red';
    }

    if (inputTmpJogo.value >= 15 && inputTmpJogo.value <= 600) {
        trTempo.style.backgroundColor = null;
    } else {
        trTempo.style.backgroundColor = 'red';
    }

    if (inputQntErros.value >= 0 && inputQntErros.value <= 5 &&
        inputTmpJogo.value >= 15 && inputTmpJogo.value <= 600) {
        reset();
    }
});

/* Botão para sair da partida */
btnSair.addEventListener('click', function () {
    perdeu();
});






function palavraAleatoria() {
    objPalavra = dicionario.getPalavra();
    jogar(objPalavra.nome);
}

function jogar(palavra) {

    if (typeof (palavra) === 'undefined') {
        palavra = plvSecretaBase.value;
        plvSecretaBase.value = '';
    }
    let caracPermitidos = /[\u0030-\u0039\u0041-\u005a\u0061-\u007a]/g

    if (palavra !== '' && removeAcento(palavra).match(caracPermitidos)) {
        divPrincipal.style.display = 'none';
        divJogo.style.display = 'block';
        btnSair.style.display = null;
        btnConfig.style.display = 'none'
        plvSecreta = palavra.toUpperCase();
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
    btnConfig.style.display = null;
    btnVoltar.style.display = 'none';
    btnSair.style.position = null;
    footer.style.position = null;
    divJogo.style.display = null;
    divPerdeu.style.display = null;
    divConfig.style.display = null;
    plvSecretaBase.value = '';
    lblTentativas.innerHTML = tentativas;
    letra.disabled = false;
    btnTestar.disabled = false;
    btnSair.disabled = false;
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

    if (forca === teste && teste !== '' && letra.disabled === false) {
        mudaCorFundo('#00ff0077', 2, body)
        setTimeout(msg, 3000);
    function msg() { telaPosJogo(0); }
        setTimeout(reset, 3100);
        atualizaPontos(++pontos);
    }
    letra.focus();
}

function perdeu() {
    letra.disabled = true;
    btnTestar.disabled = true;
    btnSair.disabled = true;
    lblForca.innerHTML = plvSecreta;
    mudaCorFundo('#ff000099', 3, body)
    clearInterval(timer);
    atualizaPontos(0);
    setTimeout(msg, 3000);
    function msg() { telaPosJogo(0); }
}

function telaPosJogo(status) {
    btnSair.style.display = 'none';
    btnVoltar.style.display = null;
    divPontos.style.display = 'none';
    divJogo.style.display = 'none';
    footer.style.position = null;
    divPerdeu.style.display = 'block';
    lblPerdeu.innerHTML = plvSecreta;
    if (status === 0) {
        tituloPosJogo.innerHTML = 'Você não acertou!'
    } else {
        tituloPosJogo.innerHTML = 'Você acertou!'
    }
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
            if (corOriginal === obj.style.backgroundColor) {
                obj.style.backgroundColor = cor;
            } else {
                contaVezes++;
                obj.style.backgroundColor = corOriginal;
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

function atualizaPontos(Pontos) {
    localStorage.setItem('pontos', Pontos);
    lblPontos.innerHTML = Pontos;
    pontos = Pontos;
};

function seletorTema() {
    tema = slctTema.selectedIndex;
    localStorage.setItem('tema', tema);
    divTemaCustom.style.display = 'none';

    switch (slctTema.selectedIndex) {

        /* Tema Preto */
        case 0:
            corFundo = 'rgb(0, 0, 0)';
            document.body.style.backgroundColor = corFundo;
            document.body.style.color = '#fff';
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = '#313233';
                allInputs[i].style.color = '#fff';
            }
            break;


        /* Tema Escuro */
        case 1:
            corFundo = 'rgb(49, 50, 51)';
            document.body.style.backgroundColor = corFundo;
            document.body.style.color = '#fff';
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = '#515253';
                allInputs[i].style.color = '#fff';
            }
            break;


        /* Tema Nuvens */
        case 2:
            corFundo = 'rgb(173, 216, 230)';
            body.style.backgroundColor = corFundo;
            body.style.color = '#000';
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = 'rgb(230, 235, 245)';
                allInputs[i].style.color = '#000';
            }
            break;


        /* Tema Claro */
        case 3:
            corFundo = 'rgb(240, 240, 240)';
            document.body.style.backgroundColor = corFundo;
            document.body.style.color = '#000';
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = 'rgb(225, 225, 225)';
                allInputs[i].style.color = '#000';
            }
            break;


        /* Tema Customizado */
        case 4:
            divTemaCustom.style.display = null;
            corFundo = inputToRGB(corFundoVerm.value, corFundoVerde.value, corFundoAzul.value);
            let corTexto = inputToRGB(corTextoVerm.value, corTextoVerde.value, corTextoAzul.value);
            let corFundoInput = inputToRGB(corBotaoVerm.value, corBotaoVerde.value, corBotaoAzul.value);
            document.body.style.backgroundColor = corFundo;
            document.body.style.color = corTexto;
            for (let i = 0; i < allInputs.length; i++) {
                allInputs[i].style.backgroundColor = corFundoInput;
                allInputs[i].style.color = corTexto;
            }
            /* salvarTemaCustom(corFundo, corTexto, corFundoInput) */
            break;
    }
}

function inputToRGB(in1, in2, in3) {
    if (in1 !== '' || in2 !== '' || in3 !== '') {
        if (in1 === '') { in1 = 0 }
        if (in2 === '') { in2 = 0 }
        if (in3 === '') { in3 = 0 }
    }

    let RGB = 'rgb(' + in1 + ', ' + in2 + ', ' + in3 + ')'
    return (RGB);
}


function dropdown(id) {
    if (id.style.display === 'none') {
        id.style.display = 'block';
    } else {
        id.style.display = 'none';
    };
}

function salvarTemaCustom (a, b, c) {
    let abc = [];
    abc.push(a);
    abc.push(b);
    abc.push(c);
    localStorage.setItem('temaCustom', abc);
}