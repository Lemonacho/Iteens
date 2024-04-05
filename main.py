from flask import *
import webbrowser
import sqlite3
import os
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
                                                                                                                        # СОЗДАНИЕ БД
conn = sqlite3.connect('./db/USER.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, name TEXT, password TEXT, email TEXT)''')

conn.commit()
conn.close()
                                                                                                                # ПОДКЛЮЧЕНИЯ JS,HTML,CSS И Т.Д
JavaScript_Floder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'JS')
Css_Floder = os.path.join(os.path.dirname(os.path.abspath(__file__)),'css')
Html_Folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'html')
database_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db')
Images_Floder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
Favicons_Folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'favicon')
Fonts_Folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Fonts')

@app.route('/JS/<path:filename>')
def serve_JavaScript(filename):
    return send_from_directory(JavaScript_Floder, filename)

@app.route('/css/<path:filename>')
def serve_Css(filename):
    return send_from_directory(Css_Floder, filename)

@app.route('/html/<path:filename>')
def serve_Html(filename):
    return send_from_directory(Html_Folder, filename)

@app.route('/db/<path:filename>')
def serve_database(filename):
    return send_from_directory(database_folder, filename)

@app.route('/img/<path:filename>')
def serve_Images(filename):
    return send_from_directory(Images_Floder, filename)

@app.route('/favicon/<path:filename>')
def serve_Favicons(filename):
    return send_from_directory(Favicons_Folder, filename)

@app.route('/Fonts/<path:filename>')
def serve_Fonts(filename):
    return send_from_directory(Fonts_Folder, filename)

@app.route('/')
def index():
    return send_file(os.path.join(Html_Folder, 'index.html'))

# проверка существования логина + пароля при логине
@app.route('/check_login', methods=['POST'])
def check_login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    try:
        login_valid = check_login_valid(username, password)
        return jsonify({'success': login_valid})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500 

def check_login_valid(username, password):
    conn = sqlite3.connect('./db/USER.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE name=? AND password=?", (username, password))
    user = cursor.fetchone()
    conn.close()
    return user is not None

# ОТПРАВКА КОДА НА ПОЧТУ ДЛЯ ВЕРИФИКАЦИИ
@app.route('/send_email', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = data['email']
    verification_code = data['code']
    try:
        send_verification_email(email, verification_code)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

def send_verification_email(email, verification_code):
    msg = EmailMessage()
    msg.set_content(f"Ваш код для верификации: {verification_code}")

    msg['Subject'] = 'Код для верификации аккаунта' 
    msg['From'] = 'stepswithashield@gmail.com' 
    msg['To'] = email

    with smtplib.SMTP('smtp.gmail.com', 587) as server: 
        server.starttls()
        server.login("stepswithashield@gmail.com", "uebc teai qomw zeoi")  
        server.send_message(msg)

# ОТПРАВКА КОДА НА ПОЧТУ ДЛЯ "Забыл пароль"
@app.route('/send_forgot_code', methods=['POST'])
def send_code():
    data = request.get_json()
    username = data['username']
    forgot_code = data['ForgotCode']
    try:
        email = get_email_for_username(username)
        if email:
            send_forgot_email(email, forgot_code)
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Пользователь не найден'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

def send_forgot_email(email, forgot_code):
    msg = EmailMessage()
    msg.set_content(f"Ваш код для восстановления пароля: {forgot_code}")

    msg['Subject'] = 'Код для восстановления пароля' 
    msg['From'] = 'stepswithashield@gmail.com' 
    msg['To'] = email

    with smtplib.SMTP('smtp.gmail.com', 587) as server: 
        server.starttls()
        server.login("stepswithashield@gmail.com", "uebc teai qomw zeoi")  
        server.send_message(msg)

# Обнова пароля
@app.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()
    username = data['username']
    new_password = data['new_password']
    
    try:
        update_password_in_database(username, new_password)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ОБНОВА ПАРОЛЯ
def update_password_in_database(username, new_password):
    conn = sqlite3.connect('./db/USER.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password=? WHERE name=?", (new_password, username))
    conn.commit()
    conn.close()

def get_email_for_username(username):
    conn = sqlite3.connect('./db/USER.db')
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM users WHERE name=?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user[0] if user else None

# проверка зантости username при регистрации
@app.route('/check_username', methods=['POST'])
def check_username():
    data = request.get_json()
    username = data['username']

    try:
        username_exists = check_username_exists(username)
        return jsonify({'exists': username_exists})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def check_username_exists(username):
    conn = sqlite3.connect('./db/USER.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE name=?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user is not None

# Проверка занятости email при регистрации
@app.route('/check_email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data['email']
    try:
        email_exists = check_email_exists(email)
        return jsonify({'exists': email_exists})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 

def check_email_exists(email):
    conn = sqlite3.connect('./db/USER.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()
    return user is not None

# ЗАНОС В БАЗУ
def insert_user(username, password, email):
    try:
        conn = sqlite3.connect('./db/USER.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, password, email) VALUES (?, ?, ?)",
                       (username, password, email))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Error:", e)
        return False

# Данные при реге
@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']
    
    try:
        insert_user(username, password, email)  
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


                                                                                                                                    # ЗАПУСК ЛАЙВ СЕРВЕРА
if __name__ == '__main__':
    if not os.getenv("WERKZEUG_RUN_MAIN"):  
        webbrowser.open_new_tab("http://localhost:8000")
    app.run(port=8000, debug=True)