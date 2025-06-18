from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def initialize_db():
    with sqlite3.connect('todos.db') as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0
            )
        ''')
initialize_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/todos', methods=['GET'])
def get_todos():
    with sqlite3.connect('todos.db') as conn:
        c = conn.cursor()
        c.execute('SELECT * FROM todos')
        rows = c.fetchall()
    todos = [{"id": row[0], "text": row[1], "completed": bool(row[2])} for row in rows]
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    with sqlite3.connect('todos.db') as conn:
        c = conn.cursor()
        c.execute('INSERT INTO todos (task, completed) VALUES (?, 0)', (data['text'],))
        conn.commit()
        todo_id = c.lastrowid
    return jsonify({"id": todo_id, "text": data['text'], "completed": False})

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    with sqlite3.connect('todos.db') as conn:
        c = conn.cursor()
        c.execute('UPDATE todos SET completed = ?  WHERE id = ?', (int(data['completed']), todo_id))
        conn.commit()
    return jsonify(success=True)

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    with sqlite3.connect('todos.db') as conn:
        c = conn.cursor()
        c.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
        conn.commit()
    return jsonify({success: True})

if __name__ == '__main__':
    app.run(debug=True)