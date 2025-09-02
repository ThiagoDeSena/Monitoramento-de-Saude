document.addEventListener("DOMContentLoaded", function () {
    const medicationsContainer = document.getElementById("medications-container");
    const medicationsLoading = document.getElementById("medications-loading");
    const medicationsList = document.getElementById("medications-list");
    const medicationsEmpty = document.getElementById("medications-empty");
    const medicationsError = document.getElementById("medications-error");
    const retryBtn = document.getElementById("retry-medications");
    const medicationTemplate = document.getElementById("medication-item-template");

    // Função para mostrar estado específico
    function showState(state) {
        // Esconder todos os estados
        medicationsLoading.classList.add("hidden");
        medicationsList.classList.add("hidden");
        medicationsEmpty.classList.add("hidden");
        medicationsError.classList.add("hidden");

        // Mostrar o estado solicitado
        document.getElementById(`medications-${state}`).classList.remove("hidden");
    }

    // Função para buscar medicamentos de hoje
    async function loadTodayMedications() {
        console.log("=== CARREGANDO MEDICAMENTOS DE HOJE ===");

        showState('loading');

        try {
            // Obter user_id do localStorage
            const userId = localStorage.getItem('user_id');

            if (!userId) {
                console.error("User ID não encontrado no localStorage");
                showErrorState("Usuário não identificado. Faça login novamente.");
                return;
            }

            console.log("User ID:", userId);

            // Fazer requisição para a API
            const response = await fetch(`http://localhost:3000/medications/today/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Status da resposta:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro da API:", errorData);
                throw new Error(errorData.message || 'Erro ao carregar medicamentos');
            }

            const data = await response.json();
            console.log("Dados recebidos:", data);

            if (!data.success) {
                throw new Error(data.message || 'Erro ao carregar medicamentos');
            }

            // Exibir os medicamentos
            displayMedications(data.data, data.current_day);

        } catch (error) {
            console.error("Erro ao carregar medicamentos:", error);
            showErrorState(error.message);
        }
    }

    // Função para exibir os medicamentos na tela
    function displayMedications(medications, currentDay) {
        console.log("=== EXIBINDO MEDICAMENTOS ===");
        console.log("Medicamentos:", medications);
        console.log("Dia atual:", currentDay);

        // Limpar lista existente
        medicationsList.innerHTML = '';

        if (!medications || medications.length === 0) {
            showState('empty');
            return;
        }

        // Criar elementos para cada medicamento
        medications.forEach((med, index) => {
            const medicationElement = createMedicationElement(med, index);
            medicationsList.appendChild(medicationElement);
        });

        // Mostrar a lista
        showState('list');

        console.log(`✅ ${medications.length} medicamentos exibidos`);
    }

    // Função para criar elemento de medicamento
    function createMedicationElement(medication, index) {
        // Clonar o template
        const template = medicationTemplate.content.cloneNode(true);
        const medicationElement = template.querySelector('.medication-item');

        // Preencher os dados
        const nameElement = template.querySelector('.medication-name');
        const timeElement = template.querySelector('.medication-time');
        const confirmBtn = template.querySelector('.confirm-medication-btn');

        nameElement.textContent = medication.display_name;
        timeElement.textContent = medication.display_time;

        // Adicionar ID único para o elemento
        medicationElement.setAttribute('data-medication-id', medication.id);
        medicationElement.setAttribute('data-index', index);

        // Adicionar evento ao botão de confirmar
        confirmBtn.addEventListener('click', function () {
            handleMedicationConfirm(medication, medicationElement);
        });

        return medicationElement;
    }

    // Função para lidar com confirmação de medicamento
    function handleMedicationConfirm(medication, element) {
        console.log("=== CONFIRMANDO MEDICAMENTO ===");
        console.log("Medicamento:", medication);

        // Adicionar estado visual de confirmado
        element.style.opacity = '0.6';
        element.style.transform = 'scale(0.98)';

        // Alterar botão
        const confirmBtn = element.querySelector('.confirm-medication-btn');
        const originalText = confirmBtn.querySelector('span').textContent;
        confirmBtn.querySelector('span').textContent = '✓ Tomado';
        confirmBtn.classList.remove('bg-[var(--green-accent)]');
        confirmBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        confirmBtn.disabled = true;

        // Aqui você pode adicionar lógica para salvar no backend que o medicamento foi tomado
        // Por exemplo: saveMedicationTaken(medication.id);

        console.log(`✅ Medicamento ${medication.name} confirmado como tomado`);

        // Opcional: remover da lista após alguns segundos
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease-out';
            element.style.opacity = '0';
            element.style.transform = 'scale(0.9)';

            setTimeout(() => {
                element.remove();

                // Verificar se ainda há medicamentos na lista
                const remainingMeds = medicationsList.querySelectorAll('.medication-item');
                if (remainingMeds.length === 0) {
                    showCompletedState();
                }
            }, 300);
        }, 2000);
    }

    // Função para mostrar estado de erro
    function showErrorState(message) {
        showState('error');
        const errorContainer = medicationsError.querySelector('p:last-child');
        if (errorContainer) {
            errorContainer.textContent = message;
        }
    }

    // Função para mostrar estado de todos medicamentos tomados
    function showCompletedState() {
        medicationsList.innerHTML = `
            <div class="text-center p-8">
                <div class="text-[var(--green-accent)] space-y-2">
                    <div class="text-4xl">✓</div>
                    <p class="text-lg font-semibold">Parabéns!</p>
                    <p class="text-sm text-[var(--dark-gray)]">Você tomou todos os medicamentos de hoje.</p>
                </div>
            </div>
        `;
    }

    // Evento para tentar novamente
    if (retryBtn) {
        retryBtn.addEventListener('click', loadTodayMedications);
    }

    // Função para atualizar medicamentos (pode ser chamada periodicamente)
    function refreshMedications() {
        console.log("🔄 Atualizando lista de medicamentos");
        loadTodayMedications();
    }

    // Carregar medicamentos ao iniciar a página
    loadTodayMedications();

    // Opcional: Atualizar automaticamente a cada 5 minutos
    setInterval(refreshMedications, 5 * 60 * 1000);

    // Expor funções globalmente para uso externo se necessário
    window.medicationsManager = {
        refresh: refreshMedications,
        load: loadTodayMedications
    };

    console.log("✅ Script de medicamentos carregado com sucesso!");
});