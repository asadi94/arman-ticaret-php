from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from server.database.db import db

class ContentModel(db.Model):
    __tablename__ = 'content'
    
    id = Column(Integer, primary_key=True)
    key = Column(String(100), unique=True, nullable=False)   # مانند hero_title
    value = Column(Text, nullable=False)                     # مقدار محتوا
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
