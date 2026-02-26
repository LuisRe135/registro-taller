from database import db

# class Taller(db.Model):
#     __tablename__ = 'talleres'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50), unique=True, nullable=False)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     password = db.Column(db.String(255), nullable=False)

#     # Relaciones
#     revisiones = db.relationship('Revision', back_populates='taller', lazy=True)

#     def __init__(self, name, email, password):
#         self.name = name
#         self.email = email
#         self.password = password

#     def serialize(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "email": self.email,
#             "revisiones": [rev.serialize_basic() for rev in self.revisiones]
#         }


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
