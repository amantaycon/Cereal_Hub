from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token
import json

@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


@require_POST
def register_user(request):
    data = json.loads(request.body)
    full_name = data.get('fullName')  # Not directly used in User model
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    # Basic validation
    if not all([full_name, email, username, password]):
        return JsonResponse({'error': 'All fields are required'}, status=400)

    # Check if user already exists
    if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
        return JsonResponse({'message': 'User already exists'}, status=409)

    # Create user with hashed password using set_password()
    user = User.objects.create_user(username=username, email=email, password=password)
    user.first_name = full_name  # Store full name in first_name field (or customize model)
    user.save()

    return JsonResponse({'message': 'User registered successfully'}, status=201)


@require_POST
def login_user(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return JsonResponse({'error': 'Username and password are required'}, status=400)

    # Try username or email for login
    user = authenticate(request, username=username, password=password)
        
    if not user:
        try:
            # Try to authenticate using email instead of username
            from django.contrib.auth.models import User
            email_user = User.objects.get(email=username)
            user = authenticate(request, username=email_user.username, password=password)
        except User.DoesNotExist:
            user = None

    if user:
        login(request, user)  # Set the session
        return JsonResponse({'message': 'Login successful', 'user_id': user.id, 'username': user.username}, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)


def logout_user(request):
    from django.contrib.auth import logout
    logout(request)
    return JsonResponse({'message': 'Logout successful'}, status=200)