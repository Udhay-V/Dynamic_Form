# Full Stack Developer Technical Assessment — Final Submission

**Candidate**: Udhaya  
**Role**: Full Stack Developer  
**Project**: Dynamic Form Builder & Scalable Form Submission System  
**Stack**: React.js, Redux Toolkit, Node.js, Express.js, PostgreSQL (Prisma ORM)  

---

## 1. Project Deliverables

| Deliverable | Location / URL | Description |
| :--- | :--- | :--- |
| **GitHub Repository** | `https://github.com/Udhay-V/dynamic-form-builder` *(or your target repo)* | Complete frontend & backend source code with git history |
| **Postman Collection** | [`postman/Dynamic_Form_Builder_API.postman_collection.json`](postman/Dynamic_Form_Builder_API.postman_collection.json) | v2.1 format covering all Auth, Form, and Submission endpoints |
| **Postman Environment** | [`postman/Form_Builder_Environment.postman_environment.json`](postman/Form_Builder_Environment.postman_environment.json) | Pre-configured environment variables (`baseUrl`, `token`, etc.) |
| **Documentation & Architecture** | [`README.md`](README.md) | In-depth system design, DB design, scaling, and Redux rationale |
| **Containerization** | [`docker-compose.yml`](docker-compose.yml) | Docker setup with PostgreSQL 17, backend, and frontend |

---

## 2. Connecting via DBeaver (PostgreSQL)

You can connect **DBeaver** to the active local PostgreSQL database with these parameters:

| Parameter | Value |
| :--- | :--- |
| **Database Driver** | PostgreSQL |
| **Host** | `localhost` or `127.0.0.1` |
| **Port** | `5432` |
| **Database** | `formbuilder_db` (or `postgres`) |
| **Username** | `postgres` |
| **Password** | `12345` |

### Tables Visible in DBeaver:
1. `public.users`: Admin user accounts (password hashed with bcrypt).
2. `public.forms`: Dynamic forms metadata and the `fields` JSONB column containing the dynamic field definitions.
3. `public.submissions`: Submissions received, with the `data` JSONB column storing the participants' answers, plus `ipAddress`, `userAgent`, and `submittedAt`.

### Useful Queries to Run in DBeaver:
```sql
-- 1. View all forms and their field definitions
SELECT id, name, status, department, jsonb_array_length(fields) AS field_count, created_at
FROM forms;

-- 2. View all submissions with submitted JSON answers
SELECT id, form_id, data, submitted_at, ip_address
FROM submissions
ORDER BY submitted_at DESC;

-- 3. Query inside the dynamic JSONB response data
SELECT 
    id, 
    data->>'firstName' AS first_name, 
    data->>'email' AS email, 
    data->>'gender' AS gender,
    submitted_at
FROM submissions
WHERE data->>'gender' = 'Female';
```

---

## 3. Pushing to Your GitHub Repository

The git repository is initialized locally and all files are committed. To push to your GitHub account:

```bash
# 1. Add your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/Udhay-V/dynamic-form-builder.git

# 2. Rename branch to main if preferred (or keep master)
git branch -M main

# 3. Push code to GitHub
git push -u origin main
```

---

## 4. Key Functional Highlights

1. **Admin Form Builder**:
   - Manages all metadata: `name`, `mail`, `gender`, `mobile`, `description`, `department`, `designation`, `role`.
   - Supports all 9 field types: `TEXT`, `EMAIL`, `NUMBER`, `PHONE`, `TEXTAREA`, `DATE`, `SELECT`, `RADIO`, `CHECKBOX`.
   - Reorder fields up/down; configure options; toggle **Draft** vs **Published**.

2. **User Dynamic Form Rendering (`/forms/:formId`)**:
   - Fetches schema dynamically from the database and renders modular components.
   - Adding a new field in PostgreSQL requires **zero frontend code changes**.

3. **Independent Server Validation (`POST /api/forms/:formId/submissions`)**:
   - Backend performs independent verification: required status, email format, telephone syntax, number bounds, and **allowed option whitelist validation** for select/radio/checkbox.

4. **Submission Management**:
   - Paginated table view, single submission detail inspector modal, deletion, and 1-click **Export to CSV**.

5. **Redux Toolkit Architecture**:
   - Slices: `authSlice`, `formsSlice`, `formBuilderSlice`, `formRenderSlice`, `submissionsSlice`.
   - Clear distinction between global Redux state vs. component local state.

6. **Scalability (10M+ submissions, 50k+ forms)**:
   - PostgreSQL JSONB with GIN indexing (`jsonb_path_ops`).
   - Declarative range table partitioning by timestamp.
   - Asynchronous queue-based ingestion (Kafka / BullMQ) for high-concurrency traffic spikes.
   - Keyset cursor pagination for constant $O(\log N)$ performance.

---

## 5. Automated Test Results

- **17 / 17 tests passed** across API validation and E2E lifecycle suites.
- Run anytime using: `cd backend && npm test`.
