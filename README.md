# Quiz Project – Aplicación Educativa (React + Flask)

Este proyecto corresponde al desarrollo de una solución digital educativa utilizando la metodología ágil **Scrum**.  
La aplicación implementa un **quiz educativo** bajo una arquitectura **cliente-servidor**, con dos tipos de usuarios:

- Estudiante: responde quizzes y visualiza sus resultados.
- Profesor (Administrador): crea quizzes y revisa los resultados de los estudiantes.

El objetivo principal es aplicar Scrum de forma práctica, mediante la planificación, desarrollo incremental y entrega continua de valor.

---

## Tecnologías utilizadas

### Frontend
- React
- Vite
- JavaScript
- Axios
- React Router DOM

### Backend
- Python 3
- Flask
- Flask-CORS

---

## Estructura del proyecto

```text
Quiz-proyect/
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ ├── routes/
│ │ ├── auth.py
│ │ └── quiz.py
│ └── data/
│ └── mock_data.py
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ ├── package.json
│ └── package-lock.json
│
├── .gitignore
└── README.md
