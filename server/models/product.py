from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from server.database.db import db

class ProductModel(db.Model):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    model = Column(String(100), nullable=False)
    brand = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)
    images = Column(JSON, default=list)
    description = Column(Text)
    specs = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model': self.model,
            'brand': self.brand,
            'category': self.category,
            'images': self.images or [],
            'description': self.description,
            'specs': self.specs or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }