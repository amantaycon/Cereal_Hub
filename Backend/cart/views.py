from django.shortcuts import render
from django.http import JsonResponse
from .models import CartItem 
from dashboard.models import Product

import json

def cart_remove(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            item_id = data.get('productId')
            userid = request.user.id

            if not item_id:
                return JsonResponse({"error": "Item ID is required."}, status=400)

            # Remove the cart item
            try:
                cart_item = CartItem.objects.get(item_id=item_id, user_id=userid)
                cart_item.delete()
                return JsonResponse({"success": True, "message": f"Item {item_id} removed from cart."}, status=200)
            except CartItem.DoesNotExist:
                return JsonResponse({"error": "Cart item not found."}, status=404)
        else:
            return JsonResponse({"error": "User is not authenticated."}, status=401)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


def get_cart(request):
    if request.user.is_authenticated:
        userid = request.user.id
        cart_items = CartItem.objects.filter(user_id=userid)
        cart_data = []
        for item in cart_items:

            product = Product.objects.filter(id=item.item_id).first()
            if product:
                cart_data.append({
                    "id": product.id,
                    "user_id": item.user_id,
                    "quantity": item.quantity,
                    "name": product.name,
                    "price": product.price,
                    "image": request.build_absolute_uri(f"/media/{product.image}"),
                    "description": product.description,
                })
            
        return JsonResponse(cart_data, safe=False, status=200)
    else:
        return JsonResponse({"error": "User is not authenticated."}, status=401)

# Create your views here.
def cart_add(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            item_id = data.get('productId')
            quantity = data.get('quantity')
            userid = request.user.id

            if not item_id or not quantity:
                return JsonResponse({"error": "Item ID and quantity are required."}, status=400)
            try:
                quantity = int(quantity)
                if quantity <= 0:
                    return JsonResponse({"error": "Quantity must be a positive integer."}, status=400)
            except ValueError:
                return JsonResponse({"error": "Invalid quantity format."}, status=400)
            
            # Create or update the cart item
            cart_item, created = CartItem.objects.update_or_create(
                item_id=item_id,
                user_id=userid,
                defaults={'quantity': quantity}
            )
            if created:
                message = f"Item {item_id} with quantity {quantity} added to cart for user {userid}."
            else:
                message = f"Item {item_id} updated to quantity {quantity} for user {userid}."
            # Return a success response
            return JsonResponse({"success": True, "message": message}, status=200)
        else:
            return JsonResponse({"error": "User is not authenticated."}, status=401)