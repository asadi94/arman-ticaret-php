from pydantic import BaseModel, validator
from typing import List, Optional

class ProductSpecsSchema(BaseModel):
    brand: str
    model: str
    type: str
    material: Optional[str] = None
    application: Optional[str] = None

class ProductCreateSchema(BaseModel):
    name: str
    model: str
    brand: str
    category: str
    description: str
    specs: ProductSpecsSchema
    images: Optional[List[str]] = []

    @validator('category')
    def validate_category(cls, v):
        allowed = ['kilit', 'mentese', 'conta', 'damper']
        if v not in allowed:
            raise ValueError(f'دسته‌بندی باید یکی از این‌ها باشد: {", ".join(allowed)}')
        return v

    @validator('brand')
    def validate_brand(cls, v):
        allowed = ['atos', 'emka', 'siemens', 'mesan']
        if v.lower() not in allowed:
            raise ValueError(f'برند باید یکی از این‌ها باشد: {", ".join(allowed)}')
        return v.lower()

class ProductUpdateSchema(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    specs: Optional[ProductSpecsSchema] = None
    images: Optional[List[str]] = None