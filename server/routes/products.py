from flask import Blueprint, request, jsonify
from server.services.product_service import ProductService
from server.utils.auth_helper import admin_required
from werkzeug.exceptions import BadRequest, NotFound
from server.utils.file_helper import save_file

bp = Blueprint('products', __name__, url_prefix='/api/products')

@bp.route('/', methods=['GET'])
def get_products():
    brand = request.args.get('brand')
    category = request.args.get('category')

    if brand:
        products = ProductService.get_by_brand(brand)
    elif category:
        products = ProductService.get_by_category(category)
    else:
        products = ProductService.get_all()

    return jsonify({
        'success': True,
        'data': products,
        'total': len(products)
    })

@bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = ProductService.get_by_id(product_id)
    return jsonify({
        'success': True,
        'data': product
    })

@bp.route('/', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    product = ProductService.create(data)
    return jsonify({
        'success': True,
        'data': product,
        'message': 'محصول با موفقیت اضافه شد'
    }), 201

@bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    data = request.get_json()
    product = ProductService.update(product_id, data)
    return jsonify({
        'success': True,
        'data': product,
        'message': 'محصول با موفقیت ویرایش شد'
    })

@bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    ProductService.delete(product_id)
    return jsonify({
        'success': True,
        'message': 'محصول با موفقیت حذف شد'
    })

@bp.route('/<int:product_id>/images', methods=['POST'])
@admin_required
def upload_image(product_id):
    if 'image' not in request.files:
        raise BadRequest('هیچ فایلی ارسال نشده است')

    file = request.files['image']
    filename = save_file(file, 'products')
    product = ProductService.add_image(product_id, filename)

    return jsonify({
        'success': True,
        'data': product,
        'message': 'عکس با موفقیت آپلود شد'
    })