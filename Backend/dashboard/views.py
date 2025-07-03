
from .models import Product
from django.http import JsonResponse
from django.views.decorators.http import require_POST

# Create your views here.
def get_all_products(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    products = list(Product.objects.values(
        'id', 'name', 'price', 'description', 'extra_info', 'image'
    ))

    for product in products:
        if product['image']:
            product['image'] = request.build_absolute_uri(f"/media/{product['image']}")

        else:
            product['image'] = None

    return JsonResponse({"products": products}, status=200)



@require_POST
def add_new_product(request):
    if request.user.is_authenticated and request.user.username == "amantaycon":
        productName = request.POST.get("productName")
        price = request.POST.get("price")
        description = request.POST.get("description")
        extra_info = request.POST.get("extraDetails", "")
        image = request.FILES.get("image")  # Get the uploaded image file


        # Basic validation
        if not all([productName, price, description, image]):
            return JsonResponse({"success": False, "message": "All fields are required"}, status=400)
        try:
            price = float(price)
        except ValueError:
            return JsonResponse({"success": False, "message": "Invalid price format"}, status=400)
        # Save product
        product = Product(
            name=productName,
            price=price,
            description=description,
            extra_info=extra_info,
            image=image
        )
        product.save()

        return JsonResponse({
            "success": True,
            "message": "Product added successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "extra_info": product.extra_info,
                "image": request.build_absolute_uri(f"/media/{product.image}")
            }
        }, status=201)

    return JsonResponse({"success": False, "message": "Invalid user request"}, status=403)



def product(request, id):

    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    product_data = {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "extra_info": product.extra_info,
        "image": request.build_absolute_uri(f"/media/{product.image}") if product.image else None
    }

    return JsonResponse({"product": product_data}, status=200)