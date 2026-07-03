// =============================
// DASHBOARD GOURMET
// Parte 1
// =============================

let receitas = [];

const listaReceitas = document.getElementById("listaReceitas");
const pesquisa = document.getElementById("pesquisa");
const categoria = document.getElementById("categoria");

const totalReceitas = document.getElementById("totalReceitas");
const totalCategorias = document.getElementById("totalCategorias");
const mediaAvaliacoes = document.getElementById("mediaAvaliacoes");
const tempoMedio = document.getElementById("tempoMedio");

const topReceitas = document.getElementById("topReceitas");

let pizzaChart;
let barraChart;

//=============================
// Carrega o JSON
//=============================

async function carregarReceitas() {

    try {

        const resposta = await fetch("receitas.json");

        receitas = await resposta.json();

        preencherCategorias();

        atualizarDashboard(receitas);

    }

    catch (erro) {

        console.error("Erro ao carregar JSON:", erro);

    }

}

//=============================
// Atualiza Dashboard
//=============================

function atualizarDashboard(lista){

    mostrarReceitas(lista);

    atualizarCards(lista);

    mostrarRanking(lista);

    criarGraficoPizza(lista);

    criarGraficoBarra(lista);

}

//=============================
// Mostra Cards
//=============================

function mostrarReceitas(lista){

    listaReceitas.innerHTML = "";

    lista.forEach(receita=>{

        listaReceitas.innerHTML += `

        <div class="receita">

            <img src="${receita.imagem}">

            <div class="info">

                <span class="categoria">

                    ${receita.categoria}

                </span>

                <h2>

                    ${receita.nome}

                </h2>

                <p>

                    ${receita.descricao}

                </p>

                <p>

                    ⏱ ${receita.tempo} minutos

                </p>

                <p>

                    ⭐ ${receita.avaliacao}

                </p>

                <button>

                    Ver Receita

                </button>

            </div>

        </div>

        `;

    });

}

//=============================
// Cards superiores
//=============================

function atualizarCards(lista){

    totalReceitas.innerHTML = lista.length;

    const categorias = [...new Set(lista.map(r=>r.categoria))];

    totalCategorias.innerHTML = categorias.length;

    const media =
    lista.reduce((s,r)=>s+r.avaliacao,0)/lista.length;

    mediaAvaliacoes.innerHTML =
    media.toFixed(1);

    const tempo =
    lista.reduce((s,r)=>s+r.tempo,0)/lista.length;

    tempoMedio.innerHTML =
    Math.round(tempo)+" min";

}

//=============================
// Select Categorias
//=============================

function preencherCategorias(){

    const categorias = [...new Set(receitas.map(r=>r.categoria))];

    categorias.forEach(cat=>{

        categoria.innerHTML +=

        `<option>${cat}</option>`;

    });

}

//=============================
// Pesquisa
//=============================

pesquisa.addEventListener("keyup",filtrar);

categoria.addEventListener("change",filtrar);

function filtrar(){

    const texto = pesquisa.value.toLowerCase();

    const cat = categoria.value;

    const resultado = receitas.filter(receita=>{

        const nome = receita.nome
        .toLowerCase()
        .includes(texto);

        const categoriaOK =
        cat==="Todas" ||
        receita.categoria===cat;

        return nome && categoriaOK;

    });

    atualizarDashboard(resultado);

}

//=============================
// GRÁFICO DE PIZZA
//=============================

function criarGraficoPizza(lista){

    const categorias = {};

    lista.forEach(receita=>{

        if(categorias[receita.categoria]){

            categorias[receita.categoria]++;

        }else{

            categorias[receita.categoria]=1;

        }

    });

    const labels = Object.keys(categorias);

    const valores = Object.values(categorias);

    if(pizzaChart){

        pizzaChart.destroy();

    }

    pizzaChart = new Chart(

        document.getElementById("graficoPizza"),

        {

            type:"pie",

            data:{

                labels:labels,

                datasets:[{

                    label:"Receitas",

                    data:valores,

                    backgroundColor:[

                        "#ff6384",
                        "#36a2eb",
                        "#ffcd56",
                        "#4bc0c0",
                        "#9966ff",
                        "#ff9f40",
                        "#66bb6a",
                        "#ef5350",
                        "#42a5f5",
                        "#8d6e63"

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}

//=============================
// GRÁFICO DE BARRAS
//=============================

function criarGraficoBarra(lista){

    const categorias={};

    lista.forEach(receita=>{

        if(!categorias[receita.categoria]){

            categorias[receita.categoria]=[];

        }

        categorias[receita.categoria].push(receita.tempo);

    });

    const labels=[];

    const medias=[];

    for(const categoria in categorias){

        labels.push(categoria);

        const soma = categorias[categoria]
        .reduce((a,b)=>a+b,0);

        medias.push(

            Math.round(

                soma/categorias[categoria].length

            )

        );

    }

    if(barraChart){

        barraChart.destroy();

    }

    barraChart = new Chart(

        document.getElementById("graficoBarra"),

        {

            type:"bar",

            data:{

                labels:labels,

                datasets:[{

                    label:"Tempo Médio (min)",

                    data:medias,

                    backgroundColor:"#ff9800",

                    borderRadius:8

                }]

            },

            options:{

                responsive:true,

                scales:{

                    y:{

                        beginAtZero:true

                    }

                },

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        }

    );

}

//=============================
// RANKING DAS MELHORES RECEITAS
//=============================

function mostrarRanking(lista){

    topReceitas.innerHTML = "";

    const ranking = [...lista]
        .sort((a,b)=>b.avaliacao-a.avaliacao)
        .slice(0,5);

    ranking.forEach(receita=>{

        topReceitas.innerHTML += `

        <div class="top-card">

            <img src="${receita.imagem}" alt="${receita.nome}">

            <div class="top-info">

                <h3>${receita.nome}</h3>

                <p><strong>Categoria:</strong> ${receita.categoria}</p>

                <p><strong>Avaliação:</strong> ⭐ ${receita.avaliacao}</p>

                <p><strong>Tempo:</strong> ⏱ ${receita.tempo} min</p>

            </div>

        </div>

        `;

    });

}

//=============================
// BOTÃO "VER RECEITA"
//=============================

document.addEventListener("click",function(e){

    if(e.target.tagName==="BUTTON"){

        const card=e.target.closest(".receita");

        const titulo=card.querySelector("h2").innerText;

        const descricao=card.querySelectorAll("p")[0].innerText;

        const tempo=card.querySelectorAll("p")[1].innerText;

        const nota=card.querySelectorAll("p")[2].innerText;

        alert(

`${titulo}

${descricao}

${tempo}

${nota}`

        );

    }

});

//=============================
// ANIMAÇÃO DOS NÚMEROS
//=============================

function animarNumero(elemento,valor){

    let atual=0;

    const incremento=Math.max(1,Math.ceil(valor/40));

    const intervalo=setInterval(()=>{

        atual+=incremento;

        if(atual>=valor){

            atual=valor;

            clearInterval(intervalo);
        }

        elemento.innerHTML=atual;

    },20);

}

//=============================
// SOBRESCREVE atualizarCards()
//=============================

const atualizarCardsOriginal = atualizarCards;

atualizarCards = function(lista){

    atualizarCardsOriginal(lista);

    animarNumero(totalReceitas,lista.length);

    const categorias = [...new Set(lista.map(r=>r.categoria))];

    animarNumero(totalCategorias,categorias.length);

}

//=============================
// INICIALIZA O DASHBOARD
//=============================

carregarReceitas();