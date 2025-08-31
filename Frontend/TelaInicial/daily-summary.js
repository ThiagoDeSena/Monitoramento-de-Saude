document.addEventListener("DOMContentLoaded", function () {
    console.log("Script de resumo diário carregado!");

    // Função para obter data atual no horário de Brasília
    function getCurrentDateBrasilia() {
        const today = new Date();
        const brasiliaTime = new Date(today.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

        const year = brasiliaTime.getFullYear();
        const month = String(brasiliaTime.getMonth() + 1).padStart(2, '0');
        const day = String(brasiliaTime.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Função para buscar dados do resumo diário
    async function fetchDailySummary() {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error("Usuário não encontrado no localStorage");
                showNoDataMessage();
                return;
            }

            const currentDate = getCurrentDateBrasilia();
            console.log("Buscando dados para:", { userId, currentDate });

            // Mudança na URL - estava com /health/ mas pode ser que sua rota seja diferente
            const response = await fetch(`http://localhost:3000/health/daily-summary?user_id=${userId}&date=${currentDate}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Dados recebidos:", result);

            if (result.success) {
                updateSummaryDisplay(result);
            } else {
                console.error("Erro ao buscar resumo:", result.message);
                showNoDataMessage();
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
            showNoDataMessage();
        }
    }

    // Função para atualizar a exibição do resumo
    function updateSummaryDisplay(data) {
        const summaryContainer = document.querySelector('#daily-summary-container');

        if (!summaryContainer) {
            console.error("Container do resumo não encontrado");
            return;
        }

        let summaryHTML = '';

        // Card da Glicemia
        if (data.glucose) {
            summaryHTML += createHealthCard(
                'Glicemia',
                data.glucose.display,
                data.glucose.status,
                data.glucose.color,
                getHealthIcon(data.glucose.color)
            );
        } else {
            summaryHTML += createNoDataCard('Glicemia', 'Nenhum registro hoje');
        }

        // Card da Pressão Arterial
        if (data.bloodPressure) {
            summaryHTML += createHealthCard(
                'Pressão Arterial',
                data.bloodPressure.display,
                data.bloodPressure.status,
                data.bloodPressure.color,
                getHealthIcon(data.bloodPressure.color)
            );
        } else {
            summaryHTML += createNoDataCard('Pressão Arterial', 'Nenhum registro hoje');
        }

        summaryContainer.innerHTML = summaryHTML;
    }

    // Função para criar card com dados
    function createHealthCard(title, value, status, color, icon) {
        const backgroundColors = {
            // green: 'bg-[var(--light-gray)] text-[var(--green-accent)]',
            // red: 'bg-red-50 text-red-500',
            // yellow: 'bg-yellow-50 text-yellow-500'
            green: 'bg-[var(--light-gray)] text-[var(--green-accent)]',
            lightgreen: 'bg-green-50 text-green-600',
            orange: 'bg-orange-50 text-orange-500',
            yellow: 'bg-yellow-50 text-yellow-500',
            red: 'bg-red-50 text-red-500',
            lightblue: 'bg-blue-50 text-blue-500'
        };

        const bgClass = backgroundColors[color] || backgroundColors.green;

        return `
            <div class="flex items-center justify-between rounded-2xl bg-[var(--secondary-color)] p-4 border border-gray-200 shadow-sm" style="min-height: 72px;">
                <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full ${bgClass}">
                        ${icon}
                    </div>
                    <div>
                        <p class="text-base font-medium text-[var(--primary-color)]">${title}</p>
                        <p class="text-sm text-[var(--dark-gray)]">${status}</p>
                    </div>
                </div>
                <p class="text-base font-bold text-[var(--primary-color)]">${value}</p>
            </div>
        `;
    }

    // Função para criar card sem dados
    function createNoDataCard(title, message) {
        return `
            <div class="flex items-center justify-between rounded-2xl bg-gray-50 p-4 border border-gray-200 shadow-sm opacity-60" style="min-height: 72px;">
                <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                        ${getNoDataIcon()}
                    </div>
                    <div>
                        <p class="text-base font-medium text-gray-500">${title}</p>
                        <p class="text-sm text-gray-400">${message}</p>
                    </div>
                </div>
                <p class="text-sm text-gray-400">--</p>
            </div>
        `;
    }

    // Função para obter ícone baseado na cor/status
    // function getHealthIcon(color) {
    //     if (color === 'green') {
    //         return `
    //             <div data-icon="CheckCircle" data-size="24px" data-weight="fill">
    //                 <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
    //                 </svg>
    //             </div>
    //         `;
    //     } else if (color === 'yellow') {
    //         return `
    //             <div data-icon="WarningCircle" data-size="24px" data-weight="fill">
    //                 <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>
    //                 </svg>
    //             </div>
    //         `;
    //     } else {
    //         return `
    //             <div data-icon="XCircle" data-size="24px" data-weight="fill">
    //                 <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
    //                 </svg>
    //             </div>
    //         `;
    //     }
    // }

    // Função para obter ícone baseado na cor/status
    function getHealthIcon(color) {
        switch (color) {
            case 'green':
                // Ícone de check para Normal/Ótimo
                return `
                    <div data-icon="CheckCircle" data-size="24px" data-weight="fill">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
                        </svg>
                    </div>
                `;

            case 'lightgreen':
                // Ícone de check mais suave para Normal
                return `
                    <div data-icon="CheckCircle" data-size="24px" data-weight="regular">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                    </div>
                `;

            case 'orange':
                // Ícone de alerta para Pré-diabetes
                return `
                    <div data-icon="Warning" data-size="24px" data-weight="fill">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>
                        </svg>
                    </div>
                `;

            case 'yellow':
                // Ícone de atenção para Pré-hipertensão
                return `
                    <div data-icon="WarningCircle" data-size="24px" data-weight="fill">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>
                        </svg>
                    </div>
                `;

            case 'red':
                // Ícone de X para condições graves (Diabetes/Hipertensão/Hipoglicemia)
                return `
                    <div data-icon="XCircle" data-size="24px" data-weight="fill">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                    </div>
                `;

            case 'lightblue':
                // Ícone de informação para Hipotensão
                return `
                    <div data-icon="Info" data-size="24px" data-weight="fill">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                        </svg>
                    </div>
                `;

            default:
                // Ícone padrão para casos não previstos
                return `
                    <div data-icon="Question" data-size="24px" data-weight="regular">
                        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                    </div>
                `;
        }
    }


    // Função para obter ícone de sem dados
    function getNoDataIcon() {
        return `
            <div data-icon="Question" data-size="24px" data-weight="regular">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                </svg>
            </div>
        `;
    }

    // Função para mostrar mensagem quando não há dados
    function showNoDataMessage() {
        const summaryContainer = document.querySelector('#daily-summary-container');
        if (!summaryContainer) return;

        summaryContainer.innerHTML = `
            <div class="text-center py-8">
                <div class="flex justify-center mb-4">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        ${getNoDataIcon()}
                    </div>
                </div>
                <p class="text-gray-500 mb-2">Nenhum registro encontrado para hoje</p>
                <p class="text-sm text-gray-400">Registre sua glicemia e pressão arterial para ver o resumo</p>
            </div>
        `;
    }

    // Função para atualizar dados (pode ser chamada quando o usuário volta para a tela)
    function refreshSummary() {
        console.log("Atualizando resumo diário...");
        fetchDailySummary();
    }

    // Inicializar quando a página carregar
    fetchDailySummary();

    // Atualizar dados quando a janela receber foco (usuário volta para a aba)
    window.addEventListener('focus', refreshSummary);

    // Expor função para atualização manual (pode ser útil)
    window.refreshDailySummary = refreshSummary;

    console.log("Script de resumo diário inicializado com sucesso!");
});