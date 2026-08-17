from server.database.db import db
from server.models.product import ProductModel
from server.schemas.product import ProductCreateSchema, ProductUpdateSchema
from werkzeug.exceptions import BadRequest, NotFound
import os

class ProductService:

    @classmethod
    def get_all(cls):
        products = ProductModel.query.all()
        return [p.to_dict() for p in products]

    @classmethod
    def get_by_id(cls, product_id: int):
        product = ProductModel.query.get(product_id)
        if not product:
            raise NotFound('محصول یافت نشد')
        return product.to_dict()

    @classmethod
    def get_by_brand(cls, brand: str):
        products = ProductModel.query.filter_by(brand=brand.lower()).all()
        return [p.to_dict() for p in products]

    @classmethod
    def get_by_category(cls, category: str):
        products = ProductModel.query.filter_by(category=category).all()
        return [p.to_dict() for p in products]

    @classmethod
    def create(cls, data: dict):
        try:
            validated = ProductCreateSchema(**data)
        except Exception as e:
            raise BadRequest(f'داده‌های ورودی نامعتبر: {str(e)}')

        product = ProductModel(
            name=validated.name,
            model=validated.model,
            brand=validated.brand,
            category=validated.category,
            description=validated.description,
            specs=validated.specs.dict(),
            images=validated.images or []
        )

        db.session.add(product)
        db.session.commit()
        return product.to_dict()

    @classmethod
    def update(cls, product_id: int, data: dict):
        product = ProductModel.query.get(product_id)
        if not product:
            raise NotFound('محصول یافت نشد')

        try:
            validated = ProductUpdateSchema(**data)
        except Exception as e:
            raise BadRequest(f'داده‌های ورودی نامعتبر: {str(e)}')

        if validated.name is not None:
            product.name = validated.name
        if validated.model is not None:
            product.model = validated.model
        if validated.brand is not None:
            product.brand = validated.brand
        if validated.category is not None:
            product.category = validated.category
        if validated.description is not None:
            product.description = validated.description
        if validated.specs is not None:
            product.specs = validated.specs.dict()
        if validated.images is not None:
            product.images = validated.images

        db.session.commit()
        return product.to_dict()

    @classmethod
    def delete(cls, product_id: int):
        product = ProductModel.query.get(product_id)
        if not product:
            raise NotFound('محصول یافت نشد')

        # حذف عکس‌ها
        for image in product.images or []:
            image_path = os.path.join('uploads/products', image)
            if os.path.exists(image_path):
                try:
                    os.remove(image_path)
                except Exception:
                    pass

        db.session.delete(product)
        db.session.commit()
        return True

    @classmethod
    def add_image(cls, product_id: int, filename: str):
        product = ProductModel.query.get(product_id)
        if not product:
            raise NotFound('محصول یافت نشد')

        if not product.images:
            product.images = []
        product.images.append(filename)

        db.session.commit()
        return product.to_dict()