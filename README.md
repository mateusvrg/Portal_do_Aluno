# Projeto Portal do Aluno (em desenvolvimento)

### **1. Planejamento e Modelagem**

**A. Definição de Usuários:**

1. **Aluno:** O consumidor principal.
2. **Professor:** Pode lançar notas, registrar faltas, subir materiais e postar avisos.
3. **Administrador:** Gerencia o cadastro de alunos, professores, turmas e disciplinas.

**B. Modelagem do Banco de Dados:**

- `Usuarios`: (ID, nome, email, senha_hash, tipo [aluno, professor, admin])
- `Alunos`: (ID, usuario_id, matricula, turma_id)
- `Professores`: (ID, usuario_id, departamento)
- `Turmas`: (ID, nome_turma, ano_letivo)
- `Disciplinas`: (ID, nome_disciplina, professor_id)
- `Matriculas`: (Tabela de ligação/junção: aluno_id, disciplina_id)
- `Notas`: (ID, aluno_id, disciplina_id, bimestre, valor_nota)
- `Frequencia`: (ID, aluno_id, disciplina_id, data, presente [booleano])
- `MateriaisAula`: (ID, disciplina_id, titulo, descricao, arquivo_url)
- `Avisos`: (ID, autor_id [professor ou admin], titulo, conteudo, data_postagem)
- `Professor_turma`: (Tabela de ligação/junção: professor_id, turma_id)

---

### 2. Back-end

- **Endpoint de Autenticação:**
  - `POST /login`:
- **Endpoints de Aluno:**
  - `GET /me/notas`: Retorna o boletim do aluno logado.
  - `GET /me/frequencia`: Retorna as faltas e presenças.
  - `GET /me/horario`: Retorna as disciplinas e horários da sua turma.
  - `GET /materiais`: Lista materiais das disciplinas matriculadas.
  - `GET /avisos`: Lista avisos da escola ou turma.
- **Endpoints de Professor:**
  - `GET /minhas-turmas`: Lista turmas e alunos do professor.
  - `POST /notas`: Lança uma nova nota para um aluno.
  - `POST /frequencia`: Lança a frequência (chamada) de uma aula.
  - `POST /materiais`: Faz upload de um novo material de aula.
  - `POST /avisos`: Cria um novo aviso.
- **Endpoints de Administrador:**
  - User **CRUD**:
      - `POST /usuarios`
      - `GET /usuarios`
      - `POST /edit/usuario`
      - `DELETE /usuarios`  
  -  Turmas **CRUD**:
      - `POST /turmas`
      - `GET /turmas`
      - `POST /edit/turmas`
      - `DELETE /turmas`  
  -  Disciplinas **CRUD**:
      - `POST /disciplinas`
      - `GET /disciplinas`
      - `POST /edit/disciplina`
      - `DELETE /disciplinas`  
  -  User **CRUD**:
      - `POST /matriculas`
      - `GET /matriculas`
      - `POST /edit/matriculas`
      - `DELETE /matriculas`

---

### 3. Frontend

Será uma **Single Page Application (SPA)**.

**A. Telas:**

- **Tela de Login:** Formulário de email e senha.
- **Dashboard (Visão do Aluno):**
  - Componente `Boletim`: Mostra as notas (busca em `GET /me/notas`).
  - Componente `Frequencia`: Mostra o histórico de presença.
  - Componente `Horario`: Mostra a grade de aulas.
  - Componente `MuralAvisos`: Lista os avisos.
- **Dashboard (Visão do Professor):**
  - Componente `SeletorTurma`: Para escolher a turma que irá gerenciar.
  - Componente `LancarNotas`: Formulário para inserir notas dos alunos.
  - Componente `FazerChamada`: Lista de alunos para marcar presença.
  - Componente `UploadMaterial`: Formulário para subir arquivos (PDF, slides, etc.).
- **Dashboard (Visão do Admin):**
  - Tabelas e formulários para criar, editar e deletar alunos, professores, turmas, etc.

---

### 4. Banco de Dados e Armazenamento

- **Banco de Dados:** Banco de dados relacional (MySQL) para armazenar os dados modelados.
- **Armazenamento de Arquivos:** Para os "Materiais de Aula" (PDFs, DOCs), os _arquivos_ serão salvos em um serviço de armazenamento de objetos.

---

### 5. Infraestrutura na Nuvem (AWS Free Tier)

1. **Backend (API):**
   - **AWS Lambda** + **Amazon API Gateway**. Cada endpoint da API vira uma função Lambda.
2. **Banco de Dados:**
   - **Amazon RDS:** Serviço de banco de dados gerenciado.
3. **Frontend (SPA):**
   - **Amazon S3:** O frontend será "buildado" (React, Vue, etc.) e os arquivos estáticos (HTML, CSS, JS) serão armazenados em um bucket S3.
4. **Armazenamento de Arquivos (Uploads dos materiais):**
   - **Amazon S3:** Será um bucket S3 para guardar os materiais de aula. O backend dará permissão temporária para o frontend fazer o upload direto para o S3.
