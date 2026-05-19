from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from database import db

admin_bp = Blueprint('admin', __name__)
bcrypt = Bcrypt()


@admin_bp.route('/', methods=['GET'])
def show_hello_world():
    return "Hola mundo", 200


# ---------- CREAR EMPLEADO (solo admin) ----------
@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        if not current_user or current_user.role != 'admin':
            return jsonify({'error': 'Solo los administradores pueden crear usuarios.'}), 403

        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')

        if not name or not email or not password:
            return jsonify({'error': 'name, email y password son requeridos.'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'El email ya está registrado.'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(name=name, email=email, password=password_hash,
                        taller_id=current_user.taller_id, role='employee')

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Usuario creado exitosamente.', 'user': new_user.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear usuario: ' + str(e)}), 500


# ---------- LISTAR USUARIOS DEL TALLER ----------
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def show_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({'error': 'Acceso restringido a administradores.'}), 403

    users = User.query.filter_by(taller_id=current_user.taller_id).all()
    return jsonify([u.serialize() for u in users]), 200
