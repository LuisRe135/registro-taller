# public_bp.py (Blueprint para las rutas públicas)
# Public está vacio para que lo llenes vos. Podes tener en cuenta las rutas de "admin_bp.py" Podrias hacer casi lo mismo acá.
# Si vas a hacer un copy paste, acordate que tenés que cambiarle los nombres a todas las rutas @admin_bp a @public_bp.
# Después no digas que no te avisé...

from flask import Blueprint, request, jsonify
from models import Revision, Car                                          # importar tabla "User" de models
from database import db  

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def home():
    return 'Home Page'

@public_bp.route('/about')
def about():
    return 'About Page'

#     GET Routes

# Ruta para encontrar un carro por placa 
@public_bp.route('/car/<placa>', methods=['GET'])
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
        placa = request.json.get('placa')

        if not razon:
            return jsonify({'error': 'La razon es obligatoria.'}), 400
        if not placa:
            return jsonify({'error': 'La placa del carro es obligatoria.'}), 400
        
        car = Car.query.filter_by(placa=placa).first()
        
        new_revision = Revision(fecha=fecha, hora=hora, razon = razon, estatus=estatus, trabajo=trabajo, car_id=car.id)

        db.session.add(new_revision)
        db.session.commit()
        return jsonify({'message': 'revision added'}), 200

    except Exception as e:
        return jsonify({'error': 'Error in revision creation: ' + str(e)}), 500
    
#  Edit an Delete 
    
@public_bp.route('/revision/<string:rev_id>', methods=['PUT'])
def edit_revision(rev_id):
    revision = Revision.query.filter_by(id=rev_id).first()
    body = request.json
    
    if not revision:
        return jsonify({"error": "revision not found"}), 404

    revision.estatus = body.get('estatus', revision.estatus)
    revision.trabajo = body.get('trabajo', revision.trabajo)
    db.session.commit()

    return jsonify({'message': 'Revision updated', 'revision': {'id': revision.id, 'estatus': revision.estatus}}), 200

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


