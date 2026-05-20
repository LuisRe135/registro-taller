from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Revision, Car, Taller, Observation, User
from database import db
from datetime import timedelta

public_bp = Blueprint('public', __name__)
bcrypt = Bcrypt()

@public_bp.route('/')
def home():
    return 'Home Page'

@public_bp.route('/about')
def about():
    return 'About Page'

#     GET Routes

@public_bp.route('/car/<placa>', methods=['GET'])
@jwt_required()
def get_car(placa):
    car = Car.query.filter_by(placa=placa).first()
    if car is None:
        return jsonify({"error": "Car not found"}), 404
    return jsonify(car.serialize()), 200


@public_bp.route('/cars', methods=['GET'])
def get_cars():
    print("get the cars to add to the flux")


@public_bp.route('/revisions/<placa>', methods=['GET'])
@jwt_required()
def get_revisions(placa):
    car = Car.query.filter_by(placa=placa).first()
    if not car:
        return jsonify({"error": "Car not found"}), 404

    revisiones = Revision.query.filter_by(car_id=car.id).all()
    return jsonify([rev.serialize_basic() for rev in revisiones]), 200


#     POST Routes

@public_bp.route('/car', methods=['POST'])
def add_car():
    try:
        placa = request.json.get('placa')
        marca = request.json.get('marca')
        modelo = request.json.get('modelo')
        year = request.json.get('year')
        owner = request.json.get('owner')
        color = request.json.get('color')

        if not placa:
            return jsonify({'error': 'La Placa es obligatoria.'}), 400

        new_car = Car(placa=placa, marca=marca, modelo=modelo, year=year, owner=owner, color=color)
        db.session.add(new_car)
        db.session.commit()
        return jsonify({'message': "car added"}), 200
    except Exception as e:
        return jsonify({'error': 'Error in car creation: ' + str(e)}), 500


@public_bp.route('/revision', methods=['POST'])
def add_revision():
    try:
        fecha = request.json.get('fecha')
        hora = request.json.get('hora')
        razon = request.json.get('razon')
        estatus = request.json.get('estatus')
        trabajo = request.json.get('trabajo')
        kilometraje = request.json.get('kilometraje')
        placa = request.json.get('placa')

        if not razon:
            return jsonify({'error': 'La razon es obligatoria.'}), 400
        if not placa:
            return jsonify({'error': 'La placa del carro es obligatoria.'}), 400

        car = Car.query.filter_by(placa=placa).first()
        if not car:
            return jsonify({'error': 'Carro no encontrado.'}), 404

        new_revision = Revision(car_id=car.id, fecha=fecha, hora=hora, razon=razon,
                                estatus=estatus, trabajo=trabajo, kilometraje=kilometraje)
        db.session.add(new_revision)
        db.session.commit()
        return jsonify(new_revision.serialize_basic()), 201

    except Exception as e:
        return jsonify({'error': 'Error in revision creation: ' + str(e)}), 500


# ----------  REGISTRO DE TALLER + ADMIN ----------
@public_bp.route('/register', methods=['POST'])
def register():
    try:
        # Taller fields
        taller_name = request.json.get('taller_name')
        phone = request.json.get('phone')
        address = request.json.get('address')

        # Admin user fields
        admin_name = request.json.get('admin_name')
        email = request.json.get('email')
        password = request.json.get('password')

        if not taller_name or not admin_name or not email or not password:
            return jsonify({'error': 'taller_name, admin_name, email y password son requeridos.'}), 400

        if Taller.query.filter_by(name=taller_name).first():
            return jsonify({'error': 'El nombre de taller ya existe.'}), 409

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'El email ya está registrado.'}), 409

        new_taller = Taller(name=taller_name, phone=phone, address=address)
        db.session.add(new_taller)
        db.session.flush()  # gets new_taller.id before commit

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        admin_user = User(name=admin_name, email=email, password=password_hash,
                          taller_id=new_taller.id, role='admin')
        db.session.add(admin_user)
        db.session.commit()

        return jsonify({
            'message': 'Taller y administrador registrados exitosamente.',
            'taller': new_taller.serialize(),
            'user': admin_user.serialize()
        }), 201

    except Exception as e:
        import traceback; traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': 'Error en el registro: ' + str(e)}), 500


# ----------  LOGIN ----------
@public_bp.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            return jsonify({'error': 'Email y password son requeridos.'}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({'error': 'Credenciales inválidas.'}), 401

        if not user.is_active:
            return jsonify({'error': 'Esta cuenta está desactivada.'}), 403

        expires = timedelta(hours=8)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)

        return jsonify({
            'access_token': access_token,
            'user': user.serialize(),
            'taller': user.taller.serialize()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Error en el login: ' + str(e)}), 500


# ----------  PERFIL DEL TALLER (solo admin) ----------
@public_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_taller():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'Usuario no encontrado.'}), 404

        if user.role != 'admin':
            return jsonify({'error': 'Solo los administradores pueden editar el perfil del taller.'}), 403

        taller = user.taller

        name = request.json.get('name')
        phone = request.json.get('phone')
        address = request.json.get('address')

        if name and name != taller.name:
            if Taller.query.filter_by(name=name).first():
                return jsonify({'error': 'El nombre de taller ya existe.'}), 409
            taller.name = name

        if phone:
            taller.phone = phone
        if address:
            taller.address = address

        db.session.commit()
        return jsonify({'message': 'Taller actualizado exitosamente.', 'taller': taller.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar: ' + str(e)}), 500


# ---------- CAMBIAR PASSWORD ----------
@public_bp.route('/change-password', methods=['PATCH'])
@jwt_required()
def change_password():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'Usuario no encontrado.'}), 404

        current_password = request.json.get('current_password')
        new_password = request.json.get('new_password')
        confirm_password = request.json.get('confirm_password')

        if not current_password or not new_password or not confirm_password:
            return jsonify({'error': 'current_password, new_password y confirm_password son requeridos.'}), 400

        if not bcrypt.check_password_hash(user.password, current_password):
            return jsonify({'error': 'La contraseña actual es incorrecta.'}), 401

        if new_password != confirm_password:
            return jsonify({'error': 'La nueva contraseña y la confirmación no coinciden.'}), 400

        if bcrypt.check_password_hash(user.password, new_password):
            return jsonify({'error': 'La nueva contraseña debe ser diferente a la actual.'}), 400

        user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({'message': 'Contraseña actualizada exitosamente.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al cambiar la contraseña: ' + str(e)}), 500


# ---------- ELIMINAR TALLER (solo admin) ----------
@public_bp.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_taller():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'Usuario no encontrado.'}), 404

        if user.role != 'admin':
            return jsonify({'error': 'Solo los administradores pueden eliminar el taller.'}), 403

        password = request.json.get('password')
        if not password:
            return jsonify({'error': 'Se requiere la contraseña para eliminar la cuenta.'}), 400

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({'error': 'Contraseña incorrecta.'}), 401

        db.session.delete(user.taller)
        db.session.commit()
        return jsonify({'message': 'Taller eliminado exitosamente.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar el taller: ' + str(e)}), 500


#  Edit

@public_bp.route('/revision/<string:rev_id>', methods=['PUT'])
@jwt_required()
def edit_revision(rev_id):
    revision = Revision.query.filter_by(id=rev_id).first()
    body = request.json

    if not revision:
        return jsonify({"error": "revision not found"}), 404

    revision.estatus = body.get('estatus', revision.estatus)
    revision.trabajo = body.get('trabajo', revision.trabajo)
    revision.kilometraje = body.get('kilometraje', revision.kilometraje)
    db.session.commit()
    return jsonify({'message': 'Revision updated', 'revision': {'id': revision.id, 'estatus': revision.estatus}}), 200


# Delete routes

@public_bp.route('/revision/<string:rev_id>', methods=['DELETE'])
def delete_revision(rev_id):
    try:
        revision = Revision.query.filter_by(id=rev_id).first()
        if not revision:
            return jsonify({"error": "revision not found"}), 404

        db.session.delete(revision)
        db.session.commit()
    except Exception as e:
        print(f"Error al eliminar la revision: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500
    return jsonify({'message': 'Revision deleted'}), 200


@public_bp.route('/observations/<int:rev_id>', methods=['GET'])
def get_observations(rev_id):
    revision = Revision.query.filter_by(id=rev_id).first()
    if not revision:
        return jsonify({"error": "Revision not found"}), 404
    return jsonify([obs.serialize_basic() for obs in revision.observaciones]), 200


@public_bp.route('/observation', methods=['POST'])
@jwt_required()
def add_observation():
    try:
        user_id = int(get_jwt_identity())
        fecha = request.json.get('fecha')
        hora = request.json.get('hora')
        observacion = request.json.get('observacion')
        revision_id = request.json.get('revision_id')

        if not revision_id:
            return jsonify({'error': 'revision_id es obligatorio.'}), 400
        if not observacion:
            return jsonify({'error': 'La observacion es obligatoria.'}), 400

        revision = Revision.query.filter_by(id=revision_id).first()
        if not revision:
            return jsonify({'error': 'Revision no encontrada.'}), 404

        new_obs = Observation(fecha=fecha, hora=hora, observacion=observacion, revision_id=revision_id, user_id=user_id)
        db.session.add(new_obs)
        db.session.commit()
        return jsonify({'message': 'Observacion agregada', 'observation': new_obs.serialize_basic()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al agregar observacion: ' + str(e)}), 500
