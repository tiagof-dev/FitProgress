const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

const selectedDateElement =
document.getElementById("selectedDate");

const checkboxesTreino =
document.querySelectorAll(
    '.treinos-grid input[type="checkbox"]'
);

const descricaoTreino =
document.getElementById("descricaoTreino");

const observacoes =
document.getElementById("observacoes");

const btnSalvar =
document.getElementById("btnSalvar");

const btnConcluir =
document.getElementById("btnConcluir");

const btnLimpar =
document.getElementById("btnLimpar");

const prevMonth =
document.getElementById("prevMonth");

const nextMonth =
document.getElementById("nextMonth");

const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

const goHome =
document.getElementById("goHome");

const goHistory =
document.getElementById("goHistory");

const searchHistory =
document.getElementById(
    "searchHistory"
);

const homePage =
document.getElementById(
    "homePage"
);

const historyPage =
document.getElementById(
    "historyPage"
);

const historyGrid =
document.getElementById(
    "historyGrid"
);

const lightTheme =
document.getElementById(
    "lightTheme"
);

const darkTheme =
document.getElementById(
    "darkTheme"
);

const modalConfirmar =
document.getElementById(
    "modalConfirmar"
);

const btnCancelarModal =
document.getElementById(
    "btnCancelarModal"
);

const btnConfirmarModal =
document.getElementById(
    "btnConfirmarModal"
);

const anoAtualElement =
document.getElementById(
    "anoAtual"
);

let currentDate = new Date();

let selectedDate = null;

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

function obterTreinosSelecionados(){

    return [...checkboxesTreino]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

}

function obterDados() {

    return JSON.parse(
        localStorage.getItem("agendaFitness")
    ) || {};

}

function salvarBanco(dados) {

    localStorage.setItem(
        "agendaFitness",
        JSON.stringify(dados)
    );

}

function formatarData(data) {

    const ano = data.getFullYear();

    const mes =
        String(data.getMonth() + 1)
        .padStart(2, "0");

    const dia =
        String(data.getDate())
        .padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}

function parseDateFromKey(key) {
    const parts = key.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function renderizarCalendario() {

    if(!calendar || !monthYear){

        return;

    }

    calendar.innerHTML = "";

    const ano =
        currentDate.getFullYear();

    const mes =
        currentDate.getMonth();

    monthYear.textContent =
        `${meses[mes]} ${ano}`;

    const primeiroDia =
        new Date(ano, mes, 1);

    const ultimoDia =
        new Date(ano, mes + 1, 0);

    const totalDias =
        ultimoDia.getDate();

    const inicioSemana =
        primeiroDia.getDay();

    for(let i = 0; i < inicioSemana; i++){

        const vazio =
        document.createElement("div");

        vazio.classList.add(
            "day",
            "empty"
        );

        calendar.appendChild(vazio);

    }

    const dados = obterDados();

    for(let dia = 1; dia <= totalDias; dia++){

        const dataAtual =
        new Date(ano, mes, dia);

        const chave =
        formatarData(dataAtual);

        const elementoDia =
        document.createElement("div");

        elementoDia.classList.add("day");

        elementoDia.textContent = dia;

        if(dados[chave]){

            if(dados[chave].concluido){

                elementoDia.classList.add(
                    "completed"
                );

            }else{

                elementoDia.classList.add(
                    "planned"
                );

            }

        }

        elementoDia.addEventListener(
            "click",
            () => selecionarDia(dataAtual)
        );

        calendar.appendChild(
            elementoDia
        );

    }

}

function selecionarDia(data){

    if(!selectedDateElement){

        return;

    }

    document
    .querySelectorAll(".day")
    .forEach(dia => {

        dia.classList.remove(
            "selected"
        );

    });

    const ano =
    data.getFullYear();

    const mes =
    data.getMonth();

    const dia =
    data.getDate();

    selectedDate = formatarData(data);

    selectedDateElement.textContent =
        `${dia}/${mes + 1}/${ano}`;

    const diasVisiveis =
    document.querySelectorAll(
        ".day:not(.empty)"
    );

    diasVisiveis.forEach(card => {

        if(
            Number(card.textContent)
            === dia
        ){

            card.classList.add(
                "selected"
            );

        }

    });

    carregarTreinoDia();

}

if(prevMonth){

prevMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderizarCalendario();

    }
);

}

if(nextMonth){

nextMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderizarCalendario();

    }
);

}

if(anoAtualElement){

anoAtualElement.textContent =
new Date().getFullYear();

}

if(calendar && monthYear){

renderizarCalendario();

}

function autoResize(textarea){

    if(!textarea){

        return;

    }

    textarea.style.height = "auto";

    textarea.style.height =
    textarea.scrollHeight + "px";

}

if(descricaoTreino && observacoes){

[descricaoTreino, observacoes]
.forEach(textarea => {

    textarea.addEventListener(
        "input",
        () => autoResize(textarea)
    );

});

}

function carregarTreinoDia(){

    if(
        !selectedDate ||
        !selectedDateElement ||
        !descricaoTreino ||
        !observacoes ||
        !btnConcluir
    ){

        return;

    }

    const dados = obterDados();

    const treino =
    dados[selectedDate];

    if(!treino){

        checkboxesTreino.forEach(
    cb => cb.checked = false
);

        descricaoTreino.value = "";

        observacoes.value = "";

        btnConcluir.textContent =
        "✔ Concluir";

        autoResize(descricaoTreino);
        autoResize(observacoes);

        return;

    }

    checkboxesTreino.forEach(
    cb => cb.checked = false
);

if(Array.isArray(treino.tipo)){

    checkboxesTreino.forEach(cb => {

        cb.checked =
        treino.tipo.includes(
            cb.value
        );

    });

    }
    else if(typeof treino.tipo === "string"){

    checkboxesTreino.forEach(cb => {

        cb.checked =
        cb.value === treino.tipo;

    });



}

    descricaoTreino.value =
    treino.descricao || "";

    observacoes.value =
    treino.observacoes || "";

    autoResize(descricaoTreino);
    autoResize(observacoes);

    if(treino.concluido){

        btnConcluir.textContent =
        "🏆 Concluído";

    }else{

        btnConcluir.textContent =
        "✔ Concluir";

    }

}

if(btnSalvar){

btnSalvar.addEventListener(
    "click",
    () => {

        if(!selectedDate){

            alert(
                "Selecione uma data."
            );

            return;

        }

        const dados = obterDados();

        const treinoExistente =
        dados[selectedDate] || {};

        dados[selectedDate] = {

            tipo:
            obterTreinosSelecionados(),

            descricao:
            descricaoTreino.value,

            observacoes:
            observacoes.value,

            concluido:
            treinoExistente.concluido || false

        };

        salvarBanco(dados);

        renderizarCalendario();

        btnSalvar.textContent =
        "✅ Salvo";

        setTimeout(() => {

            btnSalvar.textContent =
            "💾 Salvar";

        }, 1500);

    }
);

}

if(btnConcluir){

btnConcluir.addEventListener(
    "click",
    () => {

        if(!selectedDate){

            alert(
                "Selecione uma data."
            );

            return;

        }

        const dados = obterDados();

        if(!dados[selectedDate]){

            dados[selectedDate] = {

                tipo:
            obterTreinosSelecionados(),

                descricao:
                descricaoTreino.value,

                observacoes:
                observacoes.value,

                concluido:true

            };

        }else{

            dados[selectedDate]
            .concluido =
            !dados[selectedDate]
            .concluido;

        }

        salvarBanco(dados);

        carregarTreinoDia();

        renderizarCalendario();

    }
);

}

if(btnLimpar){

btnLimpar.addEventListener(
    "click",
    () => {


        if(!selectedDate){


            return;

        }

        modalConfirmar.classList.remove(
                 "hidden"
        );

    }
);

}

window.addEventListener(
    "load",
    () => {

        if(!descricaoTreino || !observacoes){

            return;

        }

        autoResize(
            descricaoTreino
        );

        autoResize(
            observacoes
        );

    }
);

const progressCircle =
document.querySelector(".circle-progress");

const progressPercent =
document.getElementById("progressPercent");

const motivationalMessage =
document.getElementById("motivationalMessage");

const totalTreinosElement =
document.getElementById("totalTreinos");

const sequenciaAtualElement =
document.getElementById("sequenciaAtual");

const treinosMesElement =
document.getElementById("treinosMes");

const metaAtualElement =
document.getElementById("metaAtual");

const metaMensal =
document.getElementById("metaMensal");

// removed unused reference to #historyList (CSS/HTML uses #historyGrid)

function atualizarDashboard(){

    if(
        !progressCircle ||
        !progressPercent ||
        !motivationalMessage ||
        !totalTreinosElement ||
        !sequenciaAtualElement ||
        !treinosMesElement ||
        !metaAtualElement ||
        !metaMensal
    ){

        return;

    }

    const dados = obterDados();

    const registros =
    Object.entries(dados);

    const concluidos =
    registros.filter(
        ([_, treino]) =>
        treino.concluido
    );

    const totalTreinos =
    concluidos.length;

    totalTreinosElement.textContent =
    totalTreinos;

    const hoje =
    new Date();

    const mesAtual =
    hoje.getMonth();

    const anoAtual =
    hoje.getFullYear();

    const treinosMes =
    concluidos.filter(
        ([data]) => {

            const d =
            parseDateFromKey(data);

            return (
                d.getMonth() === mesAtual &&
                d.getFullYear() === anoAtual
            );

        }
    ).length;

    treinosMesElement.textContent =
    treinosMes;

    const meta =
    Number(metaMensal.value);

    metaAtualElement.textContent =
    meta;

    let percentual =
    Math.round(
        (treinosMes / meta) * 100
    );

    if(percentual > 100){

        percentual = 100;

    }

    progressPercent.textContent =
    percentual + "%";

    const circunferencia = 502;

    const offset =
    circunferencia -
    (percentual / 100) *
    circunferencia;

    progressCircle.style
    .strokeDashoffset =
    offset;

    atualizarMensagem(
        percentual
    );

    atualizarHistorico(
        concluidos
    );

    atualizarSequencia(
        concluidos
    );

}

function atualizarMensagem(
    percentual
){

    if(!motivationalMessage){

        return;

    }

    if(percentual === 0){

        motivationalMessage.textContent =
        "🚀 Vamos começar!";

    }
    else if(percentual < 25){

        motivationalMessage.textContent =
        "💪 Bom começo!";

    }
    else if(percentual < 50){

        motivationalMessage.textContent =
        "🔥 Você está evoluindo!";

    }
    else if(percentual < 75){

        motivationalMessage.textContent =
        "⚡ Excelente ritmo!";

    }
    else if(percentual < 100){

        motivationalMessage.textContent =
        "🏆 Falta pouco!";

    }
    else{

        motivationalMessage.textContent =
        "🎉 Meta atingida!";

    }

}

function atualizarHistorico(
    concluidos
){

    if(!historyGrid){

        return;

    }

    historyGrid.innerHTML = "";

    const ultimos =
    [...concluidos]
    .sort((a,b)=>
        parseDateFromKey(b[0]) - parseDateFromKey(a[0])
    )
    .slice(0,10);

    if(ultimos.length === 0){

        historyGrid.innerHTML =
        `
        <div class="history-item">
            Nenhum treino concluído.
        </div>
        `;

        return;

    }

    ultimos.forEach(
        ([data, treino]) => {

            const item =
            document.createElement("div");

            item.classList.add("history-item");

            item.innerHTML = `
                <strong>
                    📅 ${data}
                </strong>

                <div>
                    🏋️ ${
                        Array.isArray(treino.tipo)
                            ? treino.tipo.join(", ")
                            : treino.tipo || "Treino"
                    }
                </div>

                ${
                    treino.descricao
                    ? `
                    <div class="history-description">
                        <strong>📝 Descrição:</strong>
                        <br>
                        ${treino.descricao}
                    </div>
                    `
                    : ""
                }

                ${
                    treino.observacoes
                    ? `
                    <div class="history-observation">
                        <strong>📌 Observações:</strong>
                        <br>
                        ${treino.observacoes}
                    </div>
                    `
                    : ""
                }
           `;

            historyGrid.appendChild(item);

        }
    );

}

function buscarHistorico(){

    if(!searchHistory || !historyGrid){

        return;

    }

    const termo =
    searchHistory.value
    .toLowerCase();

    const dados =
    obterDados();

    const registros =
    Object.entries(dados);

    const concluidos =
    registros.filter(
        ([_, treino]) =>
        treino.concluido
    );

    const filtrados =
    concluidos.filter(
        ([data, treino]) => {

            const tipo =
            Array.isArray(treino.tipo)
            ? treino.tipo.join(" ")
            : treino.tipo || "";

            return (
                data.toLowerCase().includes(termo) ||
                tipo.toLowerCase().includes(termo) ||
                (treino.descricao || "").toLowerCase().includes(termo) ||
                (treino.observacoes || "").toLowerCase().includes(termo)
            );

        }
    );

    atualizarHistorico(
        filtrados
    );

}

function atualizarSequencia(
    concluidos
){

    if(!sequenciaAtualElement){

        return;

    }

    if(concluidos.length === 0){

        sequenciaAtualElement.textContent = 0;

        return;

    }

    const datas =
    concluidos
    .map(
        ([data]) =>
        parseDateFromKey(data)
    )
    .sort((a,b) => b-a);

    let sequencia = 1;

    for(
        let i = 0;
        i < datas.length - 1;
        i++
    ){

        const atual = datas[i];
        const proxima = datas[i + 1];

        const diferenca =
        Math.floor(
            (atual - proxima) /
            (1000 * 60 * 60 * 24)
        );

        if(diferenca === 1){

            sequencia++;

        }else{

            break;

        }

    }

    sequenciaAtualElement.textContent = sequencia;

}

if(metaMensal){

metaMensal.addEventListener(
    "change",
    () => {

        localStorage.setItem(
            "metaMensal",
            metaMensal.value
        );

        atualizarDashboard();

    }
);

}

function carregarMeta(){

    if(!metaMensal){

        return;

    }

    const metaSalva =
    localStorage.getItem("metaMensal");

    if(metaSalva){

        metaMensal.value = metaSalva;

    }

}

if(btnSalvar){

btnSalvar.addEventListener(
    "click",
    () => {

        setTimeout(
            atualizarDashboard,
            100
        );

    }
);

}

if(btnConcluir){

btnConcluir.addEventListener(
    "click",
    () => {

        setTimeout(
            atualizarDashboard,
            100
        );

    }
);

}

if(menuBtn && sidebar){

menuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "open"
        );

    }
);

document.addEventListener(
    "click",
    (event) => {

        const menuAberto =
            sidebar.classList.contains(
                "open"
            );

        const clicouNoMenu =
            sidebar.contains(
                event.target
            );

        const clicouNoBotao =
            menuBtn.contains(
                event.target
            );

        if(
            menuAberto &&
            !clicouNoMenu &&
            !clicouNoBotao
        ){

            sidebar.classList.remove(
                "open"
            );

        }

    }
);

}

document
.querySelectorAll(".sidebar-link")
.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            if(sidebar){

                sidebar.classList.remove("open");

            }

        }
    );

});

function aplicarTema(
    tema
){

    document.body.classList.remove(
        "dark-theme",
        "light-theme"
    );

    document.body.classList.add(
        tema + "-theme"
    );

}

if(lightTheme){

lightTheme.addEventListener(
    "click",
    () => {

        aplicarTema("light");

        localStorage.setItem(
            "theme",
            "light"
        );

    }
);

}

if(darkTheme){

darkTheme.addEventListener(
    "click",
    () => {

        aplicarTema("dark");

        localStorage.setItem(
            "theme",
            "dark"
        );

    }
);

}

function carregarTema(){

    const temaSalvo =
    localStorage.getItem("theme");

    if(temaSalvo){

        aplicarTema(
            temaSalvo
        );

    }

}

if("serviceWorker" in navigator){

    window.addEventListener("load", () => {

        navigator.serviceWorker
        .register("./sw.js")
        .then(() => {

            console.log("PWA ativo");

        })
        .catch(error => {

            console.log(
                "Erro ao registrar PWA:",
                error
            );

        });

    });

}

if(searchHistory){

searchHistory.addEventListener(
    "input",
    buscarHistorico
);

}

if(btnCancelarModal){

btnCancelarModal.addEventListener(
    "click",
    () => {

        if(modalConfirmar){

            modalConfirmar.classList.add(
                "hidden"
            );

        }

    }
);

}

if(btnConfirmarModal){

btnConfirmarModal.addEventListener(
    "click",
    () => {

        const dados =
        obterDados();

        delete dados[
            selectedDate
        ];

        salvarBanco(
            dados
        );

        carregarTreinoDia();

        renderizarCalendario();

        atualizarDashboard();

        if(modalConfirmar){

            modalConfirmar.classList.add(
                "hidden"
            );

        }

    }
);

}

window.addEventListener(
    "load",
    () => {

        carregarMeta();

        carregarTema();

        atualizarDashboard();

    }
);