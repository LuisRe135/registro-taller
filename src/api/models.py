from database import db
from datetime import datetime, timezone

class Taller(db.Model):
    __tablename__ = 'talleres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, name, email, password, phone=None, address=None):
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.address = address

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat()
        }

class Car(db.Model):
    __tablename__ = 'cars'

    id = db.Column(db.Integer, primary_key=True)
    placa = db.Column(db.String(8), nullable=False, unique=True)
    marca = db.Column(db.String(50), nullable=True)
    modelo = db.Column(db.String(50), nullable=True)
    year = db.Column(db.Integer, nullable=True)
    owner = db.Column(db.String(50), nullable=True)
    color = db.Column(db.String(50), nullable=True)

    # Relaciones
    revisiones = db.relationship('Revision', back_populates='car', cascade="all, delete-orphan", lazy=True)

    def __init__(self, placa, marca, modelo, year, owner, color):
        self.placa = placa
        self.marca = marca
        self.modelo = modelo
        self.year = year
        self.owner = owner
        self.color = color

    def serialize(self):
        return {
            "id": self.id,
            "placa": self.placa,
            "marca": self.marca,
            "modelo": self.modelo,
            "year": self.year,
            "owner": self.owner,
            "color": self.color,
            "revisiones": [rev.serialize_basic() for rev in self.revisiones]
        }


class Revision(db.Model):
    __tablename__ = 'revisiones'

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(50), nullable=False)
    hora = db.Column(db.String(50), nullable=False)
    razon = db.Column(db.String(50), nullable=False)
    estatus = db.Column(db.String(50), nullable=True)
    trabajo = db.Column(db.String(50), nullable=True)

    # Claves foráneas
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    # taller_id = db.Column(db.Integer, db.ForeignKey('talleres.id'), nullable=False) // descomentar cuando se agregue login

    # Relaciones
    car = db.relationship('Car', back_populates='revisiones')
    observaciones = db.relationship('Observation', back_populates='revision', cascade="all, delete-orphan", lazy=True)
    # taller = db.relationship('Taller', back_populates='revisiones') // descomentar cuando se agregue el login

    def __init__(self, fecha, hora, razon, estatus, trabajo, car_id):  # Recordar poner el taller_id
        self.fecha = fecha
        self.hora = hora
        self.razon = razon
        self.estatus = estatus
        self.trabajo = trabajo
        self.car_id = car_id
        # self.taller_id = taller_id

    def serialize(self):
        return {
            "id": self.id,
            "fecha": self.fecha,
            "hora": self.hora,
            "razon": self.razon,
            "estatus": self.estatus,
            "trabajo": self.trabajo,
            "car": self.car.serialize()
            # "taller": self.taller.serialize()
        }

    def serialize_basic(self):
        # """Versión simplificada para listas."""
        return {
            "id": self.id,
            "fecha": self.fecha,
            "hora": self.hora,
            "razon": self.razon,
            "estatus": self.estatus,
            "trabajo": self.trabajo,
        }

class Observation(db.Model):
    __tablename__ = 'observaciones'

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(50), nullable=False)
    hora = db.Column(db.String(50), nullable=False)
    observacion = db.Column(db.String(50), nullable=True)

    # Claves foráneas
    revision_id = db.Column(db.Integer, db.ForeignKey('revisiones.id'), nullable=False)
    # taller_id = db.Column(db.Integer, db.ForeignKey('talleres.id'), nullable=False) // descomentar cuando se agregue login

    # Relaciones
    revision = db.relationship('Revision', back_populates='observaciones')
    # taller = db.relationship('Taller', back_populates='revisiones') // descomentar cuando se agregue el login

    def __init__(self, fecha, hora, observacion, revision_id):  # Recordar poner el taller_id
        self.fecha = fecha
        self.hora = hora
        self.observacion = observacion
        self.revision_id = revision_id
        # self.taller_id = taller_id

    def serialize(self):
        return {
            "id": self.id,
            "fecha": self.fecha,
            "hora": self.hora,
            "observacion": self.observacion,
            "revision": self.revision.serialize()
            # "taller": self.taller.serialize()
        }

    def serialize_basic(self):
        # """Versión simplificada para listas."""
        return {
            "id": self.id,
            "fecha": self.fecha,
            "hora": self.hora,
            "observacion": self.observacion,
        }
