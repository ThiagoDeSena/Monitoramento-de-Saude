# 📱 VivaBem – Monitoramento de Saúde

O **VivaBem** é um aplicativo móvel voltado para pacientes crônicos, em especial **idosos**, que auxilia no **acompanhamento da saúde diária**.  
Ele permite o registro de **sinais vitais** (como glicemia e pressão arterial), **sintomas**, **medicamentos** e **consultas**, além de emitir **alertas e notificações** quando valores saem do normal.  

A proposta do projeto é **facilitar o cuidado contínuo**, ajudando pacientes e familiares a manterem o controle de informações essenciais e fornecendo dados organizados que podem apoiar a **tomada de decisão médica**.  

> 🚀 O app também conta com a implementação de **Inteligência Artificial**, que analisa os registros e fornece **recomendações personalizadas**, resumos em linguagem natural e relatórios de fácil visualização.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML, CSS, JavaScript  
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)  
- **Backend:** Node.js + Express  
- **Banco de Dados:** [Supabase](https://supabase.com/)  
- **Auxílio em Design:** Ferramentas de IA (Stitch)  

---

## 📲 Funcionalidades

- Registro diário de **sinais vitais** (pressão arterial, glicemia).  
- Cadastro de **sintomas** e acompanhamento histórico.  
- **Lembretes** de medicamentos, consultas e exames.  
- **Alertas inteligentes** quando valores estiverem fora do normal.  
- Geração de **gráficos** para acompanhamento da evolução da saúde.  
- Integração com **IA** para recomendações, resumos e relatórios.  

---

## 📸 Telas do Projeto

*(Aqui vamos adicionar as telas que você enviar, cada uma acompanhada de uma breve descrição de sua funcionalidade.)*

### 🔐 Tela de Login

A tela inicial do **VivaBem** é o ponto de entrada para o usuário acessar o aplicativo.  
Nela, é possível entrar com **e-mail e senha previamente cadastrados**.  
Também há a opção de **login com Google** *(funcionalidade ainda não implementada)*.  

Além disso, a tela oferece alternativas para:  
- **Cadastrar uma nova conta** (para novos usuários).  
- **Entrar como cuidador ou profissional** de saúde, com acesso apenas para monitorar dados de pacientes *(não implementado ainda)*.  

<div align="center">
  <img src="https://github.com/user-attachments/assets/b9e9b46b-ab9a-4210-8df7-a4af5383c111" alt="Tela de Login" width="250px">
</div>

### 📝 Tela de Cadastro

A tela de cadastro permite que novos usuários criem uma conta no **VivaBem**.  
Para isso, o aplicativo solicita as seguintes informações:  

- **Nome completo**  
- **E-mail**  
- **Senha**  
- **Telefone de emergência**  

Todos esses dados são armazenados com segurança no banco de dados **Supabase**, garantindo que o usuário possa acessar o sistema posteriormente com seu login.  

<div align="center">
  <img src="https://github.com/user-attachments/assets/7d6c3246-7574-45d5-a507-152849f85fb0" alt="Tela de Cadastro" width="250px">
</div>

### 🏠 Tela Inicial (Home)

Após o login com autenticação via **Supabase**, o usuário é direcionado para a tela inicial do **VivaBem**.  
Ela reúne as principais funcionalidades para o acompanhamento diário da saúde do paciente.

**Principais funcionalidades:**

- 👋 **Saudação personalizada**  
  Exibe um cumprimento de *bom dia, boa tarde ou boa noite* de acordo com o horário, acompanhado do nome do usuário.  
  *(A foto de perfil ainda não está integrada ao backend)*

- 💊 **Lembrete de Medicação**  
  Cards mostram os medicamentos que o usuário deve tomar no dia, com horário específico.  
  Cada card possui um botão **“Confirmar”**, que remove o lembrete assim que o usuário toma o remédio.  
  Caso o medicamento seja recorrente, ele volta a aparecer no dia seguinte.  

  Também há um botão **“Adicionar Medicação”**, permitindo cadastrar novos medicamentos para controle diário.

- ⚡ **Registro Rápido**  
  Seção prática para anotar medições de saúde e sintomas:  
  - Glicemia  
  - Pressão arterial  
  - Sintomas (mal-estar, dores, etc.)  
  Cada botão direciona para a tela correspondente de registro.

- 🚨 **Alertas de Saúde**  
  Se algum valor registrado (como glicemia ou pressão) estiver fora da faixa normal, um **alerta visual** é exibido para chamar a atenção do usuário.  

- 📊 **Resumo do Dia**  
  Exibe os valores de glicemia e pressão registrados, com indicação se estão **normais, altos ou baixos**, tanto por texto quanto visualmente.

- 🩺 **Próximas Consultas**  
  Cards informam as consultas médicas do dia, com **tipo de consulta, profissional/local e horário**.  
  O usuário também pode adicionar novas consultas clicando em **“Adicionar Consulta”**.

- 📱 **Navegação (Navbar)**  
  Localizada no rodapé, permite acessar outras áreas do app:  
  - Início  
  - Saúde  
  - Registros  
  - Perfil  

<div align="center" style="display: flex; justify-content: space-around;">
  <img src="https://github.com/user-attachments/assets/f491a089-28c6-4bdf-97c3-93505610889b" alt="Tela Inicial 1" width="250px">
  <img src="https://github.com/user-attachments/assets/b37da3fc-f695-4000-a446-9f641d6975ab" alt="Tela Inicial 2" width="250px">
</div>

### 💊 Tela de Adicionar Medicação

Nesta tela o usuário pode **registrar suas medicações** de forma detalhada para não esquecer de tomar seus remédios.  
O formulário permite inserir:  

- **Nome do medicamento** (ex: Paracetamol)  
- **Quantidade e unidade** (mg, ml, comprimido, cápsula, etc.)  
- **Horário exato** em que deve ser tomado  
- **Dias da semana** em que o uso é recorrente (estilo alarme de celular)  
- **Descrição opcional**, como recomendações de uso (ex: tomar com água).  

Após salvar, os medicamentos cadastrados aparecem na **tela inicial**, com **notificações e lembretes** configurados de acordo com o dia e hora definidos pelo usuário. Isso garante que ele seja sempre lembrado, evitando esquecimentos.  

<div align="center">
  <img src="https://github.com/user-attachments/assets/fdcb0e40-6cbe-49ca-9572-b686b3c52564" alt="Tela de Adicionar Medicação" width="250px">
</div>



---

## 👥 Equipe

- **Thiago** – Fullstack Developer (layout, frontend, backend e banco de dados Supabase).  
- **Marlon** – Frontend Developer e Gestão de Projetos (telas do frontend, apresentações em pitch).  
- **Danilo** – Gestão de Projetos (organização e apoio no desenvolvimento).  

---

## 📌 Status do Projeto

🔨 Em desenvolvimento – MVP funcional já com cadastro de pacientes, registros de sinais vitais, sintomas, medicamentos e sistema de alertas.  

---

## 📜 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.  
