# public_bp.py (Blueprint para las rutas públicas)
# Public está vacio para que lo llenes vos. Podes tener en cuenta las rutas de "admin_bp.py" Podrias hacer casi lo mismo acá.
# Si vas a hacer un copy paste, acordate que tenés que cambiarle los nombres a todas las rutas @admin_bp a @public_bp.
# Después no digas que no te avisé...

from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Revision, Car, Taller, Observation                                          # importar tabla "User" de models
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

# Ruta para encontrar un carro por placa 
@public_bp.route('/car/<placa>', methods=['GET'])
# @jwt_required()
def get_car(placa):    
    car = Car.query.filter_by(placa=placa).first()

    if car is None:
        return jsonify({"error": "Car not found"}), 404
    
    return jsonify(car.serialize()), 200


# Ruta para obtener los carros
@public_bp.route('/cars', methods=['GET'])
def get_cars():
    print("get the cars to add to the flux")

# Ruta para obtener las revisiones
@public_bp.route('/revisions/<placa>', methods=['GET'])
@jwt_required()
def get_revisions(placa):
    car = Car.query.filter_by(placa=placa).first()
    if not car:
        return jsonify({"error": "Car not found"}), 404

    revisiones = Revision.query.filter_by(car_id=car.id).all()

    return jsonify([rev.serialize_basic() for rev in revisiones]), 200

#     POST Routes

# Ruta para agregar carro
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
        new_revision = Revision(car_id=car.id, fecha=fecha, hora=hora, razon = razon, estatus=estatus, trabajo=trabajo, kilometraje=kilometraje)

        db.session.add(new_revision)
        db.session.commit()
        return jsonify({'message': 'revision added'}), 200

    except Exception as e:
        return jsonify({'error': 'Error in revision creation: ' + str(e)}), 500
    
# ----------  REGISTRO DE TALLER ----------
@public_bp.route('/register', methods=['POST'])
def register():
    try:
        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')
        phone = request.json.get('phone')       # opcional
        address = request.json.get('address')   # opcional

        if not name or not email or not password:
            return jsonify({'error': 'Name, email y password son requeridos.'}), 400

        if Taller.query.filter_by(email=email).first():
            return jsonify({'error': 'El email ya está registrado.'}), 409

        if Taller.query.filter_by(name=name).first():
            return jsonify({'error': 'El nombre de taller ya existe.'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_taller = Taller(
            name=name,
            email=email,
            password=password_hash,
            phone=phone,
            address=address
        )

        db.session.add(new_taller)
        db.session.commit()

        return jsonify({
            'message': 'Taller registrado exitosamente.',
            'taller': new_taller.serialize()
        }), 201

    except Exception as e:
        import traceback; traceback.print_exc()
        db.session.rollback()  # Si algo falla, deshacemos cambios en la DB
        return jsonify({'error': 'Error en el registro: ' + str(e)}), 500


# ----------  LOGIN DE TALLER ----------
@public_bp.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            return jsonify({'error': 'Email y password son requeridos.'}), 400

        taller = Taller.query.filter_by(email=email).first()

        # Mismo mensaje para email y password incorrectos (seguridad)
        if not taller or not bcrypt.check_password_hash(taller.password, password):
            return jsonify({'error': 'Credenciales inválidas.'}), 401

        if not taller.is_active:
            return jsonify({'error': 'Esta cuenta está desactivada.'}), 403

        expires = timedelta(hours=8)
        access_token = create_access_token(identity=str(taller.id), expires_delta=expires)

        return jsonify({
            'access_token': access_token,
            'taller': taller.serialize()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Error en el login: ' + str(e)}), 500    
    
#  Edit
    
@public_bp.route('/revision/<string:rev_id>', methods=['PUT'])
# @jwt_required()
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


@public_bp.route('/profile', methods=['PUT'])
# @jwt_required()
def update_taller():
    try:
        taller_id = get_jwt_identity()
        taller = Taller.query.get(taller_id)

        if not taller:
            return jsonify({'error': 'Taller no encontrado.'}), 404

        # Solo actualizamos los campos que vienen en el body (los demas quedan igual)
        name = request.json.get('name')
        email = request.json.get('email')
        phone = request.json.get('phone')
        address = request.json.get('address')

        # Validamos unicidad solo si el valor cambio
        if name and name != taller.name:
            if Taller.query.filter_by(name=name).first():
                return jsonify({'error': 'El nombre de taller ya existe.'}), 409
            taller.name = name

        if email and email != taller.email:
            if Taller.query.filter_by(email=email).first():
                return jsonify({'error': 'El email ya está registrado.'}), 409
            taller.email = email

        if phone:
            taller.phone = phone

        if address:
            taller.address = address

        db.session.commit()

        return jsonify({
            'message': 'Taller actualizado exitosamente.',
            'taller': taller.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar: ' + str(e)}), 500
    
# ----------CAMBIAR PASSWORD----------
@public_bp.route('/change-password', methods=['PATCH'])
# @jwt_required()
def change_password():
    try:
        taller_id = get_jwt_identity()
        taller = Taller.query.get(taller_id)

        if not taller:
            return jsonify({'error': 'Taller no encontrado.'}), 404

        current_password = request.json.get('current_password')
        new_password = request.json.get('new_password')
        confirm_password = request.json.get('confirm_password')

        # Validamos que vengan los tres campos
        if not current_password or not new_password or not confirm_password:
            return jsonify({'error': 'current_password, new_password y confirm_password son requeridos.'}), 400

        # Verificamos que la contraseña actual sea correcta
        if not bcrypt.check_password_hash(taller.password, current_password):
            return jsonify({'error': 'La contraseña actual es incorrecta.'}), 401

        # Verificamos que la nueva contraseña y la confirmacion coincidan
        if new_password != confirm_password:
            return jsonify({'error': 'La nueva contraseña y la confirmación no coinciden.'}), 400

        # Verificamos que la nueva contraseña sea diferente a la actual
        if bcrypt.check_password_hash(taller.password, new_password):
            return jsonify({'error': 'La nueva contraseña debe ser diferente a la actual.'}), 400

        taller.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()

        return jsonify({'message': 'Contraseña actualizada exitosamente.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al cambiar la contraseña: ' + str(e)}), 500
    
# Delete routes

@public_bp.route('/profile', methods=['DELETE'])
# @jwt_required()
def delete_taller():
    try:
        taller_id = get_jwt_identity()
        taller = Taller.query.get(taller_id)

        if not taller:
            return jsonify({'error': 'Taller no encontrado.'}), 404

        password = request.json.get('password')

        if not password:
            return jsonify({'error': 'Se requiere la contraseña para eliminar la cuenta.'}), 400

        if not bcrypt.check_password_hash(taller.password, password):
            return jsonify({'error': 'Contraseña incorrecta.'}), 401

        db.session.delete(taller)
        db.session.commit()

        return jsonify({'message': 'Taller eliminado exitosamente.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar el taller: ' + str(e)}), 500
    
@public_bp.route('/observations/<int:rev_id>', methods=['GET'])
def get_observations(rev_id):
    revision = Revision.query.filter_by(id=rev_id).first()
    if not revision:
        return jsonify({"error": "Revision not found"}), 404
    return jsonify([obs.serialize_basic() for obs in revision.observaciones]), 200


@public_bp.route('/observation', methods=['POST'])
def add_observation():
    try:
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

        new_obs = Observation(fecha=fecha, hora=hora, observacion=observacion, revision_id=revision_id)
        db.session.add(new_obs)
        db.session.commit()
        return jsonify({'message': 'Observacion agregada', 'observation': new_obs.serialize_basic()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al agregar observacion: ' + str(e)}), 500


@public_bp.route('/revision/<string:rev_id>', methods=['DELETE'])
def delete_revision(rev_id):
    try:
        revision = Revision.query.filter_by(id=rev_id).first()

        if not revision:
            return jsonify({"error": "revision not found"}), 404
        

        db.session.delete(revision)
        db.session.commit()
    except Exception as e:
        print(f"Error al eliminar el viaje: {str(e)}")  # Imprimir el error en la consola
        return jsonify({"error": "Error interno del servidor"}), 500  # Retornar un error 500
    return jsonify({'message': 'Revision deleted'}), 200